'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Workspace } from '../types';
import {
  PlusIcon,
  GridViewIcon,
  ListViewIcon,
  SearchIcon,
  RefreshIcon,
  MoreVerticalIcon,
  EditIcon,
  CopyIcon,
  TrashIcon,
  ConceptStudioIcon,
  ManualBuilderIcon,
  DirectGenerationIcon,
  PhotoToModelIcon,
  AircraftBlueprintIllustration
} from '../../components/workspace/Icons';
import { Sidebar } from '../../components/Sidebar';
import { CustomDropdown } from '../../components/CustomDropdown';
import { ReactSketchCanvas } from 'react-sketch-canvas';

import { useRouter } from 'next/navigation';
import { listWorkspaces, createWorkspace, renameWorkspace, deleteWorkspace, conceptImages } from '../../lib/api';
import { ActionDropdown } from '../../components/workspace/ActionDropdown';
import { EmptyState } from '../../components/workspace/EmptyState';
import { WorkspaceCard } from '../../components/workspace/WorkspaceCard';
import { WorkspaceListRow } from '../../components/workspace/WorkspaceListRow';

export default function DashboardPage() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load workspaces from backend
  useEffect(() => {
    listWorkspaces().then(setWorkspaces).catch((e) => console.error('Failed to load workspaces:', e));
  }, []);
  
  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All Modes');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Workspace['mode']>('Concept Studio');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [modalError, setModalError] = useState('');
  const [showConceptOptions, setShowConceptOptions] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [conceptPrompt, setConceptPrompt] = useState('');
  const [conceptImgs, setConceptImgs] = useState<string[]>([]);
  const [conceptWsId, setConceptWsId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [hasSavedSketch, setHasSavedSketch] = useState(false);
  const canvasRef = useRef<any>(null);

  // Renaming State
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      // Keep it collapsed on small screens, default true otherwise
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Modal Actions
  const handleLaunchMode = (mode: string) => {
    setModalMode(mode as Workspace['mode']);
    setNewWorkspaceName('');
    setModalError('');
    setShowConceptOptions(false);
    setSelectedConcept(null);
    setIsCanvasOpen(false);
    setHasSavedSketch(false);
    setIsModalOpen(true);
  };

  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) {
      setModalError('Workspace name is required');
      return;
    }
    if (isSubmitting) return;

    // Concept Studio step 1: create workspace + generate 4 concept images
    if (modalMode === 'Concept Studio' && !showConceptOptions) {
      if (!conceptPrompt.trim()) {
        setModalError('Concept prompt is required');
        return;
      }
      setIsSubmitting(true);
      setModalError('');
      try {
        const ws = await createWorkspace(newWorkspaceName.trim(), modalMode);
        setConceptWsId(ws.id);
        setShowConceptOptions(true);
        setConceptImgs([]);
        // concept gen can take minutes on the fallback provider — kick off and show as they land
        const res = await conceptImages(ws.id, conceptPrompt.trim());
        setConceptImgs(res.images || []);
      } catch (err: any) {
        setModalError(err.message || 'Concept generation failed');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (modalMode === 'Concept Studio' && showConceptOptions) {
      if (selectedConcept === null) {
        setModalError('Please select a concept to proceed');
        return;
      }
      // ponytail: selected concept image not yet fed into image→3D; open the workspace
      router.push(`/workspace/${conceptWsId}`);
      return;
    }

    setIsSubmitting(true);
    setModalError('');
    try {
      const ws = await createWorkspace(newWorkspaceName.trim(), modalMode);
      router.push(`/workspace/${ws.id}`);
    } catch (err: any) {
      setModalError(err.message || 'Failed to create workspace');
      setIsSubmitting(false);
    }
  };

  // CRUD actions
  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameText(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (renameText.trim()) {
      const updated = workspaces.map((ws) =>
        ws.id === id ? { ...ws, name: renameText.trim(), lastEdited: 'Edited just now' } : ws
      );
      setWorkspaces(updated);
      renameWorkspace(id, renameText.trim()).catch((e) => console.error('Rename failed:', e));
    }
    setRenamingId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const handleDuplicateWorkspace = async (id: string) => {
    const target = workspaces.find((ws) => ws.id === id);
    if (!target) return;
    try {
      await createWorkspace(`${target.name} (Copy)`, target.mode);
      setWorkspaces(await listWorkspaces());
    } catch (e) {
      console.error('Duplicate failed:', e);
    }
  };

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces(workspaces.filter((ws) => ws.id !== id));
    deleteWorkspace(id).catch((e) => console.error('Delete failed:', e));
  };

  const handleResetDefaults = () => {
    listWorkspaces().then(setWorkspaces).catch(() => {});
  };

  // Filtering
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All Modes' || ws.mode === selectedMode;
    const matchesStatus = selectedStatus === 'All Statuses' || ws.status === selectedStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  const displayWorkspaces = filteredWorkspaces.slice(0, 10);

  const creationModesList = [
    {
      name: 'Blank Workspace' as const,
      description: 'Precision CAD modeler, structured drafting, and bulkhead arrangement.',
      icon: ManualBuilderIcon
    },
    {
      name: 'Concept Studio' as const,
      description: 'Generative aerodynamic shaping, wind tunnel styling, and lift optimization.',
      icon: ConceptStudioIcon
    },
    {
      name: 'Text → 3D' as const,
      description: 'Generative text-to-3D coordinates and parametric engine synthesis.',
      icon: DirectGenerationIcon
    },
    {
      name: 'Image → 3D' as const,
      description: 'Convert orthographic photos and blueprint sketches into 3D polygon meshes.',
      icon: PhotoToModelIcon
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      {/* Shared Sidebar Component */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-16' : 'pl-[220px]'}`}>
        
        {/* Main Panel Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">
             {/* 1. Header & Quick Actions */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-1">
                {new Date().getHours() < 12 ? 'Good morning, Tanveer' : new Date().getHours() < 18 ? 'Good afternoon, Tanveer' : 'Good evening, Tanveer'}
              </h1>
              <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium font-sans">
                Ready to continue your aerodynamic shaping and wind tunnel analysis?
              </p>
            </div>
            
            <button
              onClick={() => handleLaunchMode('Concept Studio')}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#cc785c] hover:bg-[#a85b42] active:scale-[0.98] text-white font-semibold text-xs rounded-lg transition-all duration-200 shadow-sm"
            >
              <PlusIcon size={16} />
              <span>New Workspace</span>
            </button>
          </header>

          {/* 2. Creation Modes Grid Header & Inline Plus sign */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#e6dfd8]/40 dark:border-[#2a2a2b]/40 pb-2">
              <div className="flex flex-col">
                <h2 className="font-serif text-xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight flex items-center">
                  Select Creation Mode
                </h2>
                <p className="text-[11px] text-[#6c6a64] dark:text-[#a09d96] font-medium">Start a new project using one of our aviation modules</p>
              </div>
            </div>
            
            {/* Top 4 Creation Mode cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {creationModesList.map((mode, idx) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLaunchMode(mode.name)}
                    className="flex flex-col text-left p-5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#cc785c]/40 hover:bg-[#cc785c]/[0.02] cursor-pointer group"
                  >
                    {/* Icon container */}
                    <div className="mb-4 p-2.5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg inline-flex self-start text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] group-hover:border-[#cc785c]/35 transition-colors duration-300">
                      <Icon size={22} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#faf9f5] mb-2 group-hover:text-[#cc785c] transition-colors duration-300">
                      {mode.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] leading-relaxed flex-grow">
                      {mode.description}
                    </p>

                    {/* Action indicator */}
                    <div className="mt-4 flex items-center space-x-1 text-[11px] font-semibold text-[#cc785c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Launch Studio</span>
                      <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Recent Workspaces Header & Tools (Search/Filters/Toggles) */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#e6dfd8]/40 dark:border-[#2a2a2b]/40 gap-4">
              <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight flex items-center">
                Recent Projects
                {workspaces.length > 0 && (
                  <span className="ml-2.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#efe9de]/35 dark:bg-[#161618]/35 text-[#6c6a64] dark:text-[#a09d96] border border-[#e6dfd8] dark:border-[#2a2a2b]">
                    {displayWorkspaces.length} of {Math.max(10, workspaces.length)}
                  </span>
                )}
              </h3>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[280px]">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#6c6a64] dark:text-[#a09d96] pointer-events-none">
                    <SearchIcon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#141413] dark:text-[#faf9f5] placeholder:text-[#6c6a64]/50 focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-colors font-medium"
                  />
                </div>

                {/* Mode Filter */}
                <div className="w-[140px]">
                  <CustomDropdown
                    value={selectedMode}
                    onChange={setSelectedMode}
                    options={['All Modes', 'Concept Studio', 'Blank Workspace', 'Text → 3D', 'Image → 3D']}
                  />
                </div>

                {/* Status Filter */}
                <div className="w-[140px]">
                  <CustomDropdown
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={['All Statuses', 'Draft', 'Active', 'Analyzing', 'Completed']}
                  />
                </div>

                <div className="h-5 w-[1px] bg-[#e6dfd8] dark:bg-[#2a2a2b] hidden sm:block" />

                {/* Grid / List Toggles */}
                <div className="flex border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg overflow-hidden bg-transparent">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c] transition-colors ${
                      viewMode === 'grid' ? 'bg-[#efe9de]/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold' : 'text-[#6c6a64] dark:text-[#a09d96]'
                    }`}
                    title="Grid View"
                  >
                    <GridViewIcon size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 border-l border-[#e6dfd8] dark:border-[#2a2a2b] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c] transition-colors ${
                      viewMode === 'list' ? 'bg-[#efe9de]/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold' : 'text-[#6c6a64] dark:text-[#a09d96]'
                    }`}
                    title="List View"
                  >
                    <ListViewIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Workspaces Rendering / Empty State */}
          <div className="flex-grow">
            {displayWorkspaces.length > 0 ? (
              viewMode === 'grid' ? (
                /* Grid view with flat transparent border-only cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayWorkspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      workspace={workspace}
                      renamingId={renamingId}
                      renameText={renameText}
                      setRenameText={setRenameText}
                      onStartRename={handleStartRename}
                      onSaveRename={handleSaveRename}
                      onRenameKeyDown={handleRenameKeyDown}
                      onDuplicate={handleDuplicateWorkspace}
                      onDelete={handleDeleteWorkspace}
                      renameInputRef={renameInputRef}
                    />
                  ))}
                </div>
              ) : (
                /* List View matching transparent styling rules */
                <div className="w-full overflow-x-auto bg-transparent">
                  <table className="w-full border-collapse text-left bg-transparent">
                    <thead>
                      <tr className="border-b border-[#e6dfd8] dark:border-[#2a2a2b] bg-transparent">
                        <th className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] px-6 py-4 w-1/3">Project Name</th>
                        <th className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] px-6 py-4 w-1/4">Creation Mode</th>
                        <th className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] px-6 py-4 w-1/6">Last Edited</th>
                        <th className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] px-6 py-4 w-1/6">Status</th>
                        <th className="px-6 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent [&>tr]:border-b [&>tr]:border-[#e6dfd8] dark:[&>tr]:border-[#2a2a2b]">
                      {displayWorkspaces.map((workspace) => (
                        <WorkspaceListRow
                          key={workspace.id}
                          workspace={workspace}
                          renamingId={renamingId}
                          renameText={renameText}
                          setRenameText={setRenameText}
                          onStartRename={handleStartRename}
                          onSaveRename={handleSaveRename}
                          onRenameKeyDown={handleRenameKeyDown}
                          onDuplicate={handleDuplicateWorkspace}
                          onDelete={handleDeleteWorkspace}
                          renameInputRef={renameInputRef}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <EmptyState onResetDefaults={workspaces.length === 0 ? handleResetDefaults : undefined} />
            )}
          </div>
        </main>
      </div>

      {/* Floating Name Prompt Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[#141413]/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Dialog */}
          <div className="relative bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] w-full max-w-md p-6 mx-4 shadow-xl z-50 transform scale-100 transition-all duration-300 ease-out">
            
            {/* Header */}
            <div className="mb-5 flex justify-between items-center">
              <h3 className="font-serif text-xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight">
                New Workspace
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#efe9de] dark:hover:bg-[#161618] rounded text-[#6c6a64] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mode Details Indicator */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                Selected Module
              </label>
              <CustomDropdown
                value={modalMode}
                onChange={(val) => {
                  setModalMode(val as any);
                  if (modalError) setModalError('');
                }}
                options={['Concept Studio', 'Blank Workspace', 'Text → 3D', 'Image → 3D']}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => {
                    setNewWorkspaceName(e.target.value);
                    if (modalError) setModalError('');
                  }}
                  autoFocus
                  placeholder="e.g. Supersonic Wing Prototype"
                  className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 font-medium placeholder:text-[#6c6a64]/40"
                />
                {modalError && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{modalError}</span>}
              </div>

              {/* Dynamic Module Fields */}
              {modalMode === 'Concept Studio' && !showConceptOptions && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                      Concept Prompt
                    </label>
                    <textarea
                      placeholder="Describe your aircraft concept..."
                      value={conceptPrompt}
                      onChange={(e) => setConceptPrompt(e.target.value)}
                      className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 font-medium placeholder:text-[#6c6a64]/40 min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center bg-[#efe9de]/30 dark:bg-[#161618]/30 p-3 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b]">
                     <span className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium">
                       {hasSavedSketch ? 'Sketch attached to concept.' : 'Have a sketch? Draw it out.'}
                     </span>
                     <button onClick={() => setIsCanvasOpen(true)} type="button" className="px-3 py-1.5 bg-[#141413] dark:bg-[#faf9f5] text-[#faf9f5] dark:text-[#141413] rounded text-[11px] font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
                       {hasSavedSketch ? 'Edit Canvas' : 'Open Canvas'}
                     </button>
                  </div>
                </div>
              )}

              {modalMode === 'Concept Studio' && showConceptOptions && (
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                    Select a Generated Concept
                  </label>
                  {conceptImgs.length === 0 && (
                    <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium animate-pulse">
                      Generating concepts… this can take a couple of minutes.
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        onClick={() => {
                          setSelectedConcept(num);
                          if (modalError) setModalError('');
                        }}
                        className={`aspect-[4/3] rounded-lg border-2 cursor-pointer transition-all overflow-hidden relative group ${
                          selectedConcept === num
                            ? 'border-[#cc785c] ring-2 ring-[#cc785c]/20'
                            : 'border-[#e6dfd8] dark:border-[#2a2a2b] hover:border-[#cc785c]/50'
                        }`}
                      >
                        {conceptImgs[num - 1] ? (
                          <img src={conceptImgs[num - 1]} alt={`Concept ${num}`} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-[#efe9de]/50 dark:bg-[#161618]/50 flex items-center justify-center animate-pulse">
                            <svg className="w-8 h-8 text-[#6c6a64]/40 dark:text-[#a09d96]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-[#141413]/80 backdrop-blur-sm rounded text-[9px] font-bold text-[#faf9f5]">
                          Option {num}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalMode === 'Text → 3D' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                    Generation Prompt
                  </label>
                  <textarea 
                    placeholder="E.g., A delta wing fighter jet with twin engines..."
                    className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 font-medium placeholder:text-[#6c6a64]/40 min-h-[80px] resize-none"
                  />
                </div>
              )}

              {modalMode === 'Image → 3D' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                    Reference Image
                  </label>
                  <label className="border-2 border-dashed border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#cc785c]/50 transition-colors bg-[#efe9de]/10 dark:bg-[#161618]/10 group">
                    <input type="file" className="hidden" accept="image/*" />
                    <svg className="w-8 h-8 text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5]">Click to upload</span>
                    <span className="text-[11px] text-[#6c6a64] dark:text-[#a09d96] mt-1">or drag and drop</span>
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#e6dfd8]/60 dark:border-[#2a2a2b]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg text-xs font-semibold text-[#6c6a64] dark:text-[#a09d96] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#cc785c] hover:bg-[#a85b42] disabled:opacity-60 rounded-lg text-xs font-semibold text-white transition-colors duration-200 shadow-sm"
                >
                  {isSubmitting
                    ? 'Working…'
                    : modalMode === 'Concept Studio' && !showConceptOptions ? 'Generate Concepts' : modalMode === 'Concept Studio' ? 'Open Workspace' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Canvas Modal */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-[60] bg-[#faf9f5] dark:bg-[#0C0C0E] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#faf9f5]/80 dark:bg-[#0C0C0E]/80 backdrop-blur-md">
            <h2 className="font-serif text-lg font-normal text-[#141413] dark:text-[#faf9f5]">Concept Drawing Canvas</h2>
            <div className="flex items-center space-x-4">
              <button type="button" onClick={() => canvasRef.current?.undo()} className="text-xs font-semibold text-[#6c6a64] hover:text-[#141413] dark:text-[#a09d96] dark:hover:text-[#faf9f5] transition-colors">Undo</button>
              <button type="button" onClick={() => canvasRef.current?.clearCanvas()} className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">Clear</button>
              <div className="w-[1px] h-4 bg-[#e6dfd8] dark:bg-[#2a2a2b]"></div>
              <button type="button" onClick={() => setIsCanvasOpen(false)} className="text-xs font-semibold text-[#6c6a64] hover:text-[#141413] dark:text-[#a09d96] dark:hover:text-[#faf9f5] transition-colors">Cancel</button>
              <button type="button" onClick={() => { setHasSavedSketch(true); setIsCanvasOpen(false); }} className="px-5 py-2 bg-[#cc785c] hover:bg-[#a85b42] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm">Save Sketch</button>
            </div>
          </div>
          <div className="flex-1 w-full bg-white dark:bg-[#161618] cursor-crosshair">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={4}
              strokeColor="#cc785c"
              canvasColor="transparent"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}
