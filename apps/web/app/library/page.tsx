'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Workspace } from '../types';
import { Sidebar } from '../../components/Sidebar';
import { CustomDropdown } from '../../components/CustomDropdown';
import { SearchableDropdown } from '../../components/workspace/SearchableDropdown';
import { GridViewIcon, ListViewIcon, SearchIcon } from '../../components/workspace/Icons';
import { mockWorkspaces, updateMockWorkspaces } from '../../lib/mockWorkspaces';
import { WorkspaceCard } from '../../components/workspace/WorkspaceCard';
import { WorkspaceListRow } from '../../components/workspace/WorkspaceListRow';
import { EmptyState } from '../../components/workspace/EmptyState';
import { Pagination } from '../../components/shared/Pagination';

const ITEMS_PER_PAGE = 12;

export default function LibraryPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);

  // Renaming State
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Sync with global mock data if it updates (e.g. navigation back/forth)
  useEffect(() => {
    setWorkspaces(mockWorkspaces);
  }, []);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMode, selectedStatus]);

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
      updateMockWorkspaces(updated);
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

  const handleDuplicateWorkspace = (id: string) => {
    const target = workspaces.find((ws) => ws.id === id);
    if (!target) return;

    const duplicate: Workspace = {
      ...target,
      id: `ws-${Date.now()}`,
      name: `${target.name} (Copy)`,
      lastEdited: 'Edited just now'
    };

    const index = workspaces.findIndex((ws) => ws.id === id);
    const updated = [...workspaces];
    updated.splice(index + 1, 0, duplicate);
    setWorkspaces(updated);
    updateMockWorkspaces(updated);
  };

  const handleDeleteWorkspace = (id: string) => {
    const updated = workspaces.filter((ws) => ws.id !== id);
    setWorkspaces(updated);
    updateMockWorkspaces(updated);
  };

  // Filtering
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All' || ws.mode === selectedMode;
    const matchesStatus = selectedStatus === 'All Statuses' || ws.status === selectedStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredWorkspaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-16' : 'pl-[220px]'}`}>
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-1">
                Library
              </h1>
              <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium font-sans">
                Browse your full project archive and manage your workspaces.
              </p>
            </div>
          </header>

          {/* Toolbar */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#e6dfd8]/40 dark:border-[#2a2a2b]/40 gap-4">
              <div className="flex-1" /> {/* Spacer */}
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[280px]">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#6c6a64] dark:text-[#a09d96] pointer-events-none">
                    <SearchIcon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#141413] dark:text-[#faf9f5] placeholder:text-[#6c6a64]/50 focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-colors font-medium"
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

                {/* Mode Filter (Searchable) */}
                <div className="w-[170px]">
                  <SearchableDropdown
                    value={selectedMode}
                    onChange={setSelectedMode}
                    options={['All', 'Concept Studio', 'Blank Workspace', 'Text → 3D', 'Image → 3D']}
                    placeholder="Search modes..."
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
          <div className="flex-grow flex flex-col">
            {displayWorkspaces.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
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
                )}
                
                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="mt-auto pt-8 pb-4 flex items-center justify-center">
                    <div className="w-full">
                      <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        totalItems={filteredWorkspaces.length} 
                        itemsPerPage={ITEMS_PER_PAGE} 
                        onPageChange={setCurrentPage} 
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState title="No projects found" description="Try a different search or filter" />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
