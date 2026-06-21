'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Workspace } from '../types';
import ActionDropdown from './ActionDropdown';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WorkspaceList({
  workspaces,
  onRename,
  onDuplicate,
  onDelete
}: WorkspaceListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId]);

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setEditName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setRenamingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const getModeBadgeClass = (mode: string) => {
    switch (mode) {
      case 'Concept Studio':
        return 'bg-[#cc785c]/10 text-[#cc785c] border-[#cc785c]/25';
      case 'Manual Builder':
        return 'bg-blue-500/10 text-blue-800 border-blue-500/25';
      case 'Direct Generation':
        return 'bg-indigo-500/10 text-indigo-800 border-indigo-500/25';
      case 'Photo to Model':
        return 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25';
      default:
        return 'bg-airix-bg text-airix-muted border-airix-border';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-airix-coral bg-airix-coral/5 px-2 py-0.5 rounded-full border border-airix-coral/10">
            <span className="w-1.5 h-1.5 rounded-full bg-airix-coral mr-1.5" />
            Active
          </span>
        );
      case 'Analyzing':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Analyzing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Completed
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-airix-muted bg-airix-bg px-2 py-0.5 rounded-full border border-airix-border">
            <span className="w-1.5 h-1.5 rounded-full bg-airix-muted/60 mr-1.5" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-airix-surface border border-airix-border rounded-[12px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-airix-border bg-airix-border/10">
            <th className="font-serif text-sm font-bold text-airix-text px-6 py-4 tracking-wide w-1/3">Project Name</th>
            <th className="font-serif text-sm font-bold text-airix-text px-6 py-4 tracking-wide w-1/4">Creation Mode</th>
            <th className="font-serif text-sm font-bold text-airix-text px-6 py-4 tracking-wide w-1/6">Last Edited</th>
            <th className="font-serif text-sm font-bold text-airix-text px-6 py-4 tracking-wide w-1/6">Status</th>
            <th className="px-6 py-4 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-airix-border/60">
          {workspaces.map((workspace) => (
            <tr
              key={workspace.id}
              className="hover:bg-airix-bg/30 transition-colors duration-150 group"
            >
              {/* Project Name & Miniature Icon */}
              <td className="px-6 py-4.5">
                <div className="flex items-center space-x-3.5">
                  {/* Decorative tiny aircraft thumbnail icon */}
                  <div className="w-9 h-9 rounded bg-[#e3dcd1] border border-airix-border flex items-center justify-center text-airix-muted group-hover:text-airix-coral transition-colors duration-200 flex-shrink-0">
                    <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                      <path d="M12 22.08V12" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    {renamingId === workspace.id ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleSaveRename(workspace.id)}
                        onKeyDown={(e) => handleKeyDown(e, workspace.id)}
                        className="w-full text-sm font-bold font-serif text-airix-text bg-airix-bg border border-airix-coral/40 rounded px-2.5 py-1"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => handleStartRename(workspace.id, workspace.name)}
                        className="font-serif text-sm font-bold text-airix-text group-hover:text-airix-coral cursor-text transition-colors duration-150 block truncate max-w-[280px]"
                        title="Double click to rename"
                      >
                        {workspace.name}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Creation Mode Badge */}
              <td className="px-6 py-4.5">
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border inline-block ${getModeBadgeClass(workspace.mode)}`}>
                  {workspace.mode}
                </span>
              </td>

              {/* Last Edited Timestamp */}
              <td className="px-6 py-4.5 text-xs text-airix-muted font-medium">
                {workspace.lastEdited}
              </td>

              {/* Status Badge */}
              <td className="px-6 py-4.5">
                {getStatusIndicator(workspace.status)}
              </td>

              {/* Action Dropdown Menu */}
              <td className="px-6 py-4.5 text-right">
                <ActionDropdown
                  onRename={() => handleStartRename(workspace.id, workspace.name)}
                  onDuplicate={() => onDuplicate(workspace.id)}
                  onDelete={() => onDelete(workspace.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
