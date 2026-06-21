'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Workspace } from '../types';
import { BlueprintThumbnail } from './Icons';
import ActionDropdown from './ActionDropdown';

interface WorkspaceCardProps {
  workspace: Workspace;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WorkspaceCard({
  workspace,
  onRename,
  onDuplicate,
  onDelete
}: WorkspaceCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleSave = () => {
    if (editName.trim() && editName.trim() !== workspace.name) {
      onRename(workspace.id, editName.trim());
    } else {
      setEditName(workspace.name);
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(workspace.name);
      setIsRenaming(false);
    }
  };

  // Get Mode Badge Style
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

  // Get Status Indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="flex items-center text-[10px] font-semibold text-airix-coral bg-airix-coral/5 px-2 py-0.5 rounded-full border border-airix-coral/10">
            <span className="w-1.5 h-1.5 rounded-full bg-airix-coral mr-1.5" />
            Active
          </span>
        );
      case 'Analyzing':
        return (
          <span className="flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Analyzing
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Completed
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="flex items-center text-[10px] font-semibold text-airix-muted bg-airix-bg px-2 py-0.5 rounded-full border border-airix-border">
            <span className="w-1.5 h-1.5 rounded-full bg-airix-muted/60 mr-1.5" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col bg-airix-surface border border-airix-border rounded-[12px] overflow-hidden group transition-all duration-300 hover:shadow-md hover:border-airix-coral/40">
      {/* Visual blueprint thumbnail */}
      <div className="h-32 w-full overflow-hidden">
        <BlueprintThumbnail projectType={workspace.mode} className="group-hover:scale-105 transition-transform duration-500 ease-out" />
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Mode Badge & Actions */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${getModeBadgeClass(workspace.mode)}`}>
            {workspace.mode}
          </span>
          <ActionDropdown
            onRename={() => setIsRenaming(true)}
            onDuplicate={() => onDuplicate(workspace.id)}
            onDelete={() => onDelete(workspace.id)}
          />
        </div>

        {/* Project Title */}
        <div className="mb-4 flex-grow">
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full text-base font-bold font-serif text-airix-text bg-airix-bg border border-airix-coral/40 rounded px-2 py-0.5"
            />
          ) : (
            <h4
              onDoubleClick={() => setIsRenaming(true)}
              className="font-serif text-base font-bold text-airix-text tracking-wide truncate group-hover:text-airix-coral cursor-text transition-colors duration-200"
              title="Double click to rename"
            >
              {workspace.name}
            </h4>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between border-t border-airix-border/60 pt-3 mt-auto">
          <span className="text-[11px] text-airix-muted font-medium">
            {workspace.lastEdited}
          </span>
          {getStatusIndicator(workspace.status)}
        </div>
      </div>
    </div>
  );
}
