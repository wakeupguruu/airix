'use client';

import React from 'react';
import { Workspace } from '../types';
import WorkspaceCard from './WorkspaceCard';

interface WorkspaceGridProps {
  workspaces: Workspace[];
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WorkspaceGrid({
  workspaces,
  onRename,
  onDuplicate,
  onDelete
}: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
