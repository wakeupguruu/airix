'use client';

import React from 'react';
import { Workspace } from '../../app/types';
import { getModeBadgeClass, getStatusIndicator } from './workspaceUtils';
import { ActionDropdown } from './ActionDropdown';
import { useRouter } from 'next/navigation';

export interface WorkspaceListRowProps {
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

export function WorkspaceListRow({
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
}: WorkspaceListRowProps) {
  const router = useRouter();

  return (
    <tr 
      onClick={() => router.push(`/workspace/${workspace.id}`)}
      className="hover:bg-[#efe9de]/30 dark:hover:bg-[#161618]/30 transition-colors duration-150 group bg-transparent cursor-pointer"
    >
      {/* Project Name */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3.5 bg-transparent">
          <div className="flex-grow bg-transparent">
            {renamingId === workspace.id ? (
              <input
                ref={renameInputRef}
                type="text"
                value={renameText}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setRenameText(e.target.value)}
                onBlur={() => onSaveRename(workspace.id)}
                onKeyDown={(e) => onRenameKeyDown(e, workspace.id)}
                className="w-full text-sm font-normal font-serif text-[#141413] dark:text-[#faf9f5] bg-transparent border border-[#cc785c]/40 rounded px-2.5 py-1 focus:outline-none"
              />
            ) : (
              <span
                onDoubleClick={() => onStartRename(workspace.id, workspace.name)}
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
          onRename={() => onStartRename(workspace.id, workspace.name)}
          onDuplicate={() => onDuplicate(workspace.id)}
          onDelete={() => onDelete(workspace.id)}
        />
      </td>
    </tr>
  );
}
