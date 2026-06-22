'use client';

import React from 'react';
import { Workspace } from '../../app/types';
import { getModeBadgeClass, getStatusIndicator } from './workspaceUtils';
import { ActionDropdown } from './ActionDropdown';

export interface WorkspaceCardProps {
  workspace: Workspace;
  renamingId: string | null;
  renameText: string;
  setRenameText: (text: string) => void;
  onStartRename: (id: string, name: string) => void;
  onSaveRename: (id: string) => void;
  onRenameKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  renameInputRef: React.RefObject<HTMLInputElement>;
}

export function WorkspaceCard({
  workspace,
  renamingId,
  renameText,
  setRenameText,
  onStartRename,
  onSaveRename,
  onRenameKeyDown,
  onDuplicate,
  onDelete,
  renameInputRef
}: WorkspaceCardProps) {
  return (
    <div className="flex flex-col bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] p-6 group transition-all duration-300 hover:border-[#cc785c]/40 hover:-translate-y-0.5">
      {/* Starts directly with the metadata text */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${getModeBadgeClass(workspace.mode)}`}>
          {workspace.mode}
        </span>
        <ActionDropdown
          onRename={() => onStartRename(workspace.id, workspace.name)}
          onDuplicate={() => onDuplicate(workspace.id)}
          onDelete={() => onDelete(workspace.id)}
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
            onBlur={() => onSaveRename(workspace.id)}
            onKeyDown={(e) => onRenameKeyDown(e, workspace.id)}
            className="w-full text-base font-normal font-serif text-[#141413] dark:text-[#faf9f5] bg-transparent border border-[#cc785c]/40 rounded px-2 py-0.5 focus:outline-none"
          />
        ) : (
          <h4
            onDoubleClick={() => onStartRename(workspace.id, workspace.name)}
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
  );
}
