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
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ConceptStudioIcon,
  ManualBuilderIcon,
  DirectGenerationIcon,
  PhotoToModelIcon,
  AircraftBlueprintIllustration,
  SidebarIconDashboard,
  SidebarIconProjects,
  SidebarIconStudio,
  SidebarIconAnalytics,
  SidebarIconSettings
} from '../../components/workspace/Icons';

// Initial Mock Workspaces mapped to new creation modes
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
    mode: 'Blank Workspace',
    status: 'Completed',
    lastEdited: 'Edited 1 day ago'
  },
  {
    id: 'ws-3',
    name: 'Biplane Struct V2 Refinement',
    mode: 'Text → 3D',
    status: 'Analyzing',
    lastEdited: 'Edited 3 days ago'
  },
  {
    id: 'ws-4',
    name: 'Glider Fuselage Photogrammetry',
    mode: 'Image → 3D',
    status: 'Draft',
    lastEdited: 'Edited 1 week ago'
  }
];

interface ActionDropdownProps {
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function ActionDropdown({ onRename, onDuplicate, onDelete }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 rounded-md text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] border border-transparent hover:border-[#e6dfd8] dark:hover:border-[#2a2a2b] transition-all duration-200"
      >
        <MoreVerticalIcon size={18} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Dropdown Box */}
          <div
            className="absolute right-0 mt-1.5 w-40 bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg shadow-md z-40 py-1 origin-top-right transition-all duration-200 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                onRename();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-[#141413] dark:text-[#faf9f5] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c] transition-colors duration-150 text-left"
            >
              <EditIcon size={14} className="mr-2.5 text-[#6c6a64] dark:text-[#a09d96]" />
              Rename
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                onDuplicate();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-[#141413] dark:text-[#faf9f5] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c] transition-colors duration-150 text-left"
            >
              <CopyIcon size={14} className="mr-2.5 text-[#6c6a64] dark:text-[#a09d96]" />
              Duplicate
            </button>

            <div className="h-[1px] bg-[#e6dfd8] dark:bg-[#2a2a2b] my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/10 hover:text-rose-700 transition-colors duration-150 text-left"
            >
              <TrashIcon size={14} className="mr-2.5 text-rose-400" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ onResetDefaults }: { onResetDefaults?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] bg-transparent text-center">
      <div className="w-48 h-28 mb-6 text-[#6c6a64] dark:text-[#a09d96] opacity-60">
        <AircraftBlueprintIllustration />
      </div>
      <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-2">No projects found</h3>
      <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] max-w-sm mb-6 leading-relaxed">
        Start creating your custom aerodynamic profiles, structured draftings, or 3D meshes using our builder modules.
      </p>
      {onResetDefaults && (
        <button
          onClick={onResetDefaults}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-[#cc785c] hover:bg-[#cc785c]/5 text-[#cc785c] font-semibold text-xs rounded-md transition-all duration-200"
        >
          <RefreshIcon size={14} />
          <span>Reset Demo Workspaces</span>
        </button>
      )}
    </div>
  );
}

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
  const [modalMode, setModalMode] = useState<Workspace['mode']>('Concept Studio');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [modalError, setModalError] = useState('');

  // Renaming State
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
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
  const handleLaunchMode = (modeName: Workspace['mode']) => {
    setModalMode(modeName);
    setNewWorkspaceName('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) {
      setModalError('Workspace name is required');
      return;
    }

    const created: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      mode: modalMode,
      status: 'Active',
      lastEdited: 'Edited just now'
    };

    setWorkspaces((prev) => [created, ...prev]);
    setIsModalOpen(false);
  };

  // CRUD actions
  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameText(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (renameText.trim()) {
      setWorkspaces((prev) =>
        prev.map((ws) => (ws.id === id ? { ...ws, name: renameText.trim(), lastEdited: 'Edited just now' } : ws))
      );
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
  };

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
  };

  const handleResetDefaults = () => {
    setWorkspaces(initialWorkspaces);
  };

  // Filtering
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All Modes' || ws.mode === selectedMode;
    const matchesStatus = selectedStatus === 'All Statuses' || ws.status === selectedStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  // Badge Styles
  const getModeBadgeClass = (mode: string) => {
    switch (mode) {
      case 'Concept Studio':
        return 'bg-[#cc785c]/10 text-[#cc785c] border-[#cc785c]/25';
      case 'Blank Workspace':
        return 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/25';
      case 'Text → 3D':
        return 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/25';
      case 'Image → 3D':
        return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25';
      default:
        return 'bg-[#efe9de]/35 dark:bg-[#161618]/35 text-[#6c6a64] dark:text-[#a09d96] border-[#e6dfd8] dark:border-[#2a2a2b]';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="flex items-center text-[10px] font-semibold text-[#cc785c] bg-[#cc785c]/5 px-2 py-0.5 rounded-full border border-[#cc785c]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c] mr-1.5" />
            Active
          </span>
        );
      case 'Analyzing':
        return (
          <span className="flex items-center text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Analyzing
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Completed
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="flex items-center text-[10px] font-semibold text-[#6c6a64] dark:text-[#a09d96] bg-[#efe9de]/35 dark:bg-[#161618]/35 px-2 py-0.5 rounded-full border border-[#e6dfd8] dark:border-[#2a2a2b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6c6a64]/60 mr-1.5" />
            Draft
          </span>
        );
    }
  };

  const creationModesList = [
    {
      name: 'Concept Studio' as const,
      description: 'Generative aerodynamic shaping, wind tunnel styling, and lift optimization.',
      icon: ConceptStudioIcon
    },
    {
      name: 'Blank Workspace' as const,
      description: 'Precision CAD modeler, structured drafting, and bulkhead arrangement.',
      icon: ManualBuilderIcon
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

  const menuItems = [
    { name: 'Dashboard', icon: SidebarIconDashboard, active: false },
    { name: 'Workspaces', icon: SidebarIconProjects, active: true },
    { name: 'Concept Lab', icon: SidebarIconStudio, active: false },
    { name: 'Analytics', icon: SidebarIconAnalytics, active: false },
    { name: 'Settings', icon: SidebarIconSettings, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      {/* Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E] border-r border-[#e6dfd8] dark:border-[#2a2a2b] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header: Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#e6dfd8] dark:border-[#2a2a2b]">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#cc785c]" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
                <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
              </svg>
              <span className="font-serif text-xl font-normal tracking-widest text-[#141413] dark:text-[#faf9f5]">AIRIX</span>
            </div>
          ) : (
            <div className="mx-auto">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#cc785c] mx-auto" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
                <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
              </svg>
            </div>
          )}
        </div>

        {/* Workspace Selector */}
        {!isCollapsed ? (
          <div className="p-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b]">
            <div className="flex items-center justify-between px-3 py-2 bg-[#efe9de]/35 dark:bg-[#161618]/35 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b] cursor-pointer hover:bg-[#efe9de]/70 dark:hover:bg-[#161618]/70 transition-colors duration-200">
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] font-semibold">Current Lab</span>
                <span className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5] truncate max-w-[140px]">Supersonic Wing Lab</span>
              </div>
              <ChevronDownIcon size={14} className="text-[#6c6a64] dark:text-[#a09d96]" />
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b] flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-[#efe9de]/35 dark:bg-[#161618]/35 border border-[#e6dfd8] dark:border-[#2a2a2b] flex items-center justify-center cursor-pointer hover:bg-[#efe9de]/70 dark:hover:bg-[#161618]/70 transition-colors duration-200">
              <span className="text-xs font-bold text-[#cc785c] font-serif">S</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group text-left ${
                  item.active
                    ? 'bg-[#cc785c] text-white shadow-sm font-medium'
                    : 'text-[#6c6a64] dark:text-[#a09d96] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 hover:text-[#141413] dark:hover:text-[#faf9f5]'
                }`}
              >
                <Icon size={20} className={`${item.active ? 'text-white' : 'text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#141413] dark:group-hover:text-[#faf9f5]'} transition-colors`} />
                {!isCollapsed && (
                  <span className="ml-3.5 text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-[#e6dfd8] dark:border-[#2a2a2b] space-y-3">
          {/* Toggle Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronRightIcon size={18} />
            ) : (
              <div className="flex items-center space-x-2">
                <ChevronLeftIcon size={18} />
                <span className="text-xs font-medium">Collapse Sidebar</span>
              </div>
            )}
          </button>

          {/* User profile */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2 py-1.5'} space-x-3`}>
            <div className="relative w-9 h-9 rounded-full bg-[#cc785c]/10 border border-[#cc785c]/30 flex items-center justify-center text-[#cc785c] font-serif font-bold text-sm">
              J
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#faf9f5] dark:border-[#0C0C0E] rounded-full"></span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5] truncate">Jonathan Archer</span>
                <span className="text-[10px] text-[#6c6a64] dark:text-[#a09d96] truncate">Chief Aero Engineer</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
        
        {/* Main Panel Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">
          
          {/* 1. Workspace Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#e6dfd8] dark:border-[#2a2a2b] pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-1">
                Your Workspaces
              </h1>
              <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium font-sans">
                Manage, catalog, and configure your aircraft design projects
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
                    className="flex flex-col text-left p-6 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#cc785c]/40 hover:bg-[#cc785c]/[0.02] cursor-pointer group"
                  >
                    {/* Icon container */}
                    <div className="mb-4 p-3 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg inline-flex self-start text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] group-hover:border-[#cc785c]/35 transition-colors duration-300">
                      <Icon size={24} />
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
                    {filteredWorkspaces.length} of {workspaces.length}
                  </span>
                )}
              </h3>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
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
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6c6a64] dark:text-[#a09d96] focus:border-[#cc785c] transition-colors appearance-none pr-7 cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px'
                  }}
                >
                  <option value="All Modes">All Modes</option>
                  <option value="Concept Studio">Concept Studio</option>
                  <option value="Blank Workspace">Blank Workspace</option>
                  <option value="Text → 3D">Text → 3D</option>
                  <option value="Image → 3D">Image → 3D</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6c6a64] dark:text-[#a09d96] focus:border-[#cc785c] transition-colors appearance-none pr-7 cursor-pointer"
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
            {filteredWorkspaces.length > 0 ? (
              viewMode === 'grid' ? (
                /* Grid view with flat transparent border-only cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="flex flex-col bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] p-6 group transition-all duration-300 hover:border-[#cc785c]/40 hover:-translate-y-0.5"
                    >
                      {/* Starts directly with the metadata text */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${getModeBadgeClass(workspace.mode)}`}>
                          {workspace.mode}
                        </span>
                        <ActionDropdown
                          onRename={() => handleStartRename(workspace.id, workspace.name)}
                          onDuplicate={() => handleDuplicateWorkspace(workspace.id)}
                          onDelete={() => handleDeleteWorkspace(workspace.id)}
                        />
                      </div>

                      {/* Project Title */}
                      <div className="mb-4 flex-grow">
                        {renamingId === workspace.id ? (
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameText}
                            onChange={(e) => setRenameText(e.target.value)}
                            onBlur={() => handleSaveRename(workspace.id)}
                            onKeyDown={(e) => handleRenameKeyDown(e, workspace.id)}
                            className="w-full text-base font-normal font-serif text-[#141413] dark:text-[#faf9f5] bg-transparent border border-[#cc785c]/40 rounded px-2 py-0.5 focus:outline-none"
                          />
                        ) : (
                          <h4
                            onDoubleClick={() => handleStartRename(workspace.id, workspace.name)}
                            className="font-serif text-base font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight truncate group-hover:text-[#cc785c] cursor-text transition-colors duration-200"
                            title="Double click to rename"
                          >
                            {workspace.name}
                          </h4>
                        )}
                      </div>

                      {/* Footer Meta */}
                      <div className="flex items-center justify-between border-t border-[#e6dfd8]/60 dark:border-[#2a2a2b]/60 pt-3 mt-auto">
                        <span className="text-[11px] text-[#6c6a64] dark:text-[#a09d96] font-medium font-sans">
                          {workspace.lastEdited}
                        </span>
                        {getStatusIndicator(workspace.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View matching transparent styling rules */
                <div className="w-full overflow-x-auto bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px]">
                  <table className="w-full border-collapse text-left bg-transparent">
                    <thead>
                      <tr className="border-b border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#e6dfd8]/10 dark:bg-[#2a2a2b]/10">
                        <th className="font-serif text-sm font-normal text-[#141413] dark:text-[#faf9f5] px-6 py-4 tracking-tight w-1/3">Project Name</th>
                        <th className="font-serif text-sm font-normal text-[#141413] dark:text-[#faf9f5] px-6 py-4 tracking-tight w-1/4">Creation Mode</th>
                        <th className="font-serif text-sm font-normal text-[#141413] dark:text-[#faf9f5] px-6 py-4 tracking-tight w-1/6">Last Edited</th>
                        <th className="font-serif text-sm font-normal text-[#141413] dark:text-[#faf9f5] px-6 py-4 tracking-tight w-1/6">Status</th>
                        <th className="px-6 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6dfd8]/60 dark:divide-[#2a2a2b]/60 bg-transparent">
                      {filteredWorkspaces.map((workspace) => (
                        <tr
                          key={workspace.id}
                          className="hover:bg-[#efe9de]/30 dark:hover:bg-[#161618]/30 transition-colors duration-150 group bg-transparent"
                        >
                          {/* Project Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3.5 bg-transparent">
                              <div className="w-9 h-9 rounded bg-[#efe9de]/40 dark:bg-[#161618]/40 border border-[#e6dfd8] dark:border-[#2a2a2b] flex items-center justify-center text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] group-hover:border-[#cc785c]/35 transition-colors duration-200 flex-shrink-0">
                                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                  <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                                  <path d="M12 22.08V12" />
                                </svg>
                              </div>
                              <div className="flex-grow bg-transparent">
                                {renamingId === workspace.id ? (
                                  <input
                                    ref={renameInputRef}
                                    type="text"
                                    value={renameText}
                                    onChange={(e) => setRenameText(e.target.value)}
                                    onBlur={() => handleSaveRename(workspace.id)}
                                    onKeyDown={(e) => handleRenameKeyDown(e, workspace.id)}
                                    className="w-full text-sm font-normal font-serif text-[#141413] dark:text-[#faf9f5] bg-transparent border border-[#cc785c]/40 rounded px-2.5 py-1 focus:outline-none"
                                  />
                                ) : (
                                  <span
                                    onDoubleClick={() => handleStartRename(workspace.id, workspace.name)}
                                    className="font-serif text-sm font-normal text-[#141413] dark:text-[#faf9f5] group-hover:text-[#cc785c] cursor-text transition-colors duration-150 block truncate max-w-[280px]"
                                    title="Double click to rename"
                                  >
                                    {workspace.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Creation Mode Badge */}
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border inline-block ${getModeBadgeClass(workspace.mode)}`}>
                              {workspace.mode}
                            </span>
                          </td>

                          {/* Last Edited Timestamp */}
                          <td className="px-6 py-4 text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium font-sans">
                            {workspace.lastEdited}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4">
                            {getStatusIndicator(workspace.status)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <ActionDropdown
                              onRename={() => handleStartRename(workspace.id, workspace.name)}
                              onDuplicate={() => handleDuplicateWorkspace(workspace.id)}
                              onDelete={() => handleDeleteWorkspace(workspace.id)}
                            />
                          </td>
                        </tr>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] block mb-1">
                Selected Module
              </span>
              <span className="text-xs font-semibold text-[#cc785c] uppercase tracking-wider">
                {modalMode}
              </span>
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
                  className="px-4 py-2 bg-[#cc785c] hover:bg-[#a85b42] rounded-lg text-xs font-semibold text-white transition-colors duration-200 shadow-sm"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
