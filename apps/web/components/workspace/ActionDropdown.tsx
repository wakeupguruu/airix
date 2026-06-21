'use client';

import React, { useState } from 'react';
import { MoreVerticalIcon, EditIcon, CopyIcon, TrashIcon } from './Icons';

interface ActionDropdownProps {
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ActionDropdown({ onRename, onDuplicate, onDelete }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-airix-bg rounded-md text-airix-muted hover:text-airix-text border border-transparent hover:border-airix-border transition-all duration-200"
      >
        <MoreVerticalIcon size={18} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div
            className="fixed inset-0 z-35"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Dropdown Box */}
          <div
            className="absolute right-0 mt-1.5 w-40 bg-airix-surface border border-airix-border rounded-lg shadow-md z-40 py-1 origin-top-right transition-all duration-200 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                onRename();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-airix-text hover:bg-airix-bg hover:text-airix-coral transition-colors duration-150 text-left"
            >
              <EditIcon size={14} className="mr-2.5 text-airix-muted" />
              Rename
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                onDuplicate();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-airix-text hover:bg-airix-bg hover:text-airix-coral transition-colors duration-150 text-left"
            >
              <CopyIcon size={14} className="mr-2.5 text-airix-muted" />
              Duplicate
            </button>

            <div className="h-[1px] bg-airix-border my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150 text-left"
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
