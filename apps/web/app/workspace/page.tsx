'use client';

import React, { useState, useEffect } from 'react';
import { Workspace } from '../types';
import Sidebar from '../../components/workspace/Sidebar';
import CreationModes from '../../components/workspace/CreationModes';
import WorkspaceGrid from '../../components/workspace/WorkspaceGrid';
import WorkspaceList from '../../components/workspace/WorkspaceList';
import EmptyState from '../../components/workspace/EmptyState';
import NewWorkspaceModal from '../../components/workspace/NewWorkspaceModal';
import { PlusIcon, GridViewIcon, ListViewIcon, SearchIcon, RefreshIcon } from '../../components/workspace/Icons';

// Initial Mock Workspaces
const initialWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'AeroFoil AX-100 Wing',
    mode: 'Concept Studio',
    status: 'Active',
    lastEdited: 'Edited 2 hours ago'
  },
  {
    id: 'ws-2',
    name: 'V-Tail UAV Mesh Profile',
    mode: 'Manual Builder',
    status: 'Completed',
    lastEdited: 'Edited 1 day ago'
  },
  {
    id: 'ws-3',
    name: 'Biplane Struct V2 Refinement',
    mode: 'Direct Generation',
    status: 'Analyzing',
    lastEdited: 'Edited 3 days ago'
  },
  {
    id: 'ws-4',
    name: 'Glider Fuselage Photogrammetry',
    mode: 'Photo to Model',
    status: 'Draft',
    lastEdited: 'Edited 1 week ago'
  }
];

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All Modes');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialMode, setModalInitialMode] = useState<string>('Concept Studio');

  // Responsive Sidebar auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Run once initially
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CRUD Actions
  const handleCreateWorkspace = (newWorkspace: Omit<Workspace, 'id' | 'lastEdited'>) => {
    const created: Workspace = {
      ...newWorkspace,
      id: `ws-${Date.now()}`,
      lastEdited: 'Edited just now'
    };
    setWorkspaces((prev) => [created, ...prev]);
  };

  const handleRenameWorkspace = (id: string, newName: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, name: newName, lastEdited: 'Edited just now' } : ws))
    );
  };

  const handleDuplicateWorkspace = (id: string) => {
    const target = workspaces.find((ws) => ws.id === id);
    if (!target) return;

    const duplicate: Workspace = {
      ...target,
      id: `ws-${Date.now()}`,
      name: `${target.name} (Copy)`,
      lastEdited: 'Edited just now'
    };

    // Insert duplicate right after original in list
    const index = workspaces.findIndex((ws) => ws.id === id);
    const updated = [...workspaces];
    updated.splice(index + 1, 0, duplicate);
    setWorkspaces(updated);
  };

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
  };

  const handleResetDefaults = () => {
    setWorkspaces(initialWorkspaces);
  };

  // Open creation modal with a specific creation mode selected
  const handleLaunchMode = (modeName: string) => {
    setModalInitialMode(modeName);
    setIsModalOpen(true);
  };

  // Filtered workspaces list
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All Modes' || ws.mode === selectedMode;
    const matchesStatus = selectedStatus === 'All Statuses' || ws.status === selectedStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-airix-bg text-airix-text flex">
      {/* Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
        
        {/* Main Panel Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col">
          
          {/* 1. Workspace Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-airix-border/70 pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-airix-text tracking-wide mb-1">
                Your Workspaces
              </h1>
              <p className="text-sm text-airix-muted font-medium">
                Manage, catalog, and configure your aircraft design projects
              </p>
            </div>
            
            <button
              onClick={() => handleLaunchMode('Concept Studio')}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-airix-coral hover:bg-airix-hover active:scale-[0.98] text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm"
            >
              <PlusIcon size={16} />
              <span>New Workspace</span>
            </button>
          </header>

          {/* 2. Creation Modes Grid */}
          <CreationModes onSelectMode={handleLaunchMode} />

          {/* 3. Recent Workspaces Header & Tools (Search/Filters/Toggles) */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-airix-border/40 gap-4">
              <h3 className="font-serif text-lg font-bold text-airix-text tracking-wide flex items-center">
                Recent Projects
                {workspaces.length > 0 && (
                  <span className="ml-2.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-airix-surface text-airix-muted border border-airix-border">
                    {filteredWorkspaces.length} of {workspaces.length}
                  </span>
                )}
              </h3>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
                  <span className="absolute inset-y-0 left-3 flex items-center text-airix-muted pointer-events-none">
                    <SearchIcon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-airix-surface border border-airix-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-airix-text placeholder:text-airix-muted/65 focus:border-airix-coral/70 transition-colors"
                  />
                </div>

                {/* Mode Filter */}
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="bg-airix-surface border border-airix-border rounded-lg px-3 py-1.5 text-xs font-semibold text-airix-muted focus:border-airix-coral transition-colors appearance-none pr-7 cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px'
                  }}
                >
                  <option value="All Modes">All Modes</option>
                  <option value="Concept Studio">Concept Studio</option>
                  <option value="Manual Builder">Manual Builder</option>
                  <option value="Direct Generation">Direct Generation</option>
                  <option value="Photo to Model">Photo to Model</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-airix-surface border border-airix-border rounded-lg px-3 py-1.5 text-xs font-semibold text-airix-muted focus:border-airix-coral transition-colors appearance-none pr-7 cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px'
                  }}
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Analyzing">Analyzing</option>
                  <option value="Completed">Completed</option>
                </select>

                <div className="h-5 w-[1px] bg-airix-border/70 hidden sm:block" />

                {/* Grid / List Toggles */}
                <div className="flex border border-airix-border rounded-lg overflow-hidden bg-airix-surface">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 hover:bg-airix-bg hover:text-airix-coral transition-colors ${
                      viewMode === 'grid' ? 'bg-airix-bg text-airix-coral font-bold' : 'text-airix-muted'
                    }`}
                    title="Grid View"
                  >
                    <GridViewIcon size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 border-l border-airix-border hover:bg-airix-bg hover:text-airix-coral transition-colors ${
                      viewMode === 'list' ? 'bg-airix-bg text-airix-coral font-bold' : 'text-airix-muted'
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
            {filteredWorkspaces.length > 0 ? (
              viewMode === 'grid' ? (
                <WorkspaceGrid
                  workspaces={filteredWorkspaces}
                  onRename={handleRenameWorkspace}
                  onDuplicate={handleDuplicateWorkspace}
                  onDelete={handleDeleteWorkspace}
                />
              ) : (
                <WorkspaceList
                  workspaces={filteredWorkspaces}
                  onRename={handleRenameWorkspace}
                  onDuplicate={handleDuplicateWorkspace}
                  onDelete={handleDeleteWorkspace}
                />
              )
            ) : (
              <EmptyState onResetDefaults={workspaces.length === 0 ? handleResetDefaults : undefined} />
            )}
          </div>
        </main>
      </div>

      {/* New Workspace Creation Modal */}
      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
        initialMode={modalInitialMode}
      />
    </div>
  );
}
