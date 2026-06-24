'use client';

import React, { useState } from 'react';
import { MoreVerticalIcon, EditIcon, CopyIcon, TrashIcon } from './Icons';

export interface ActionDropdownProps {
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ActionDropdown({ onRename, onDuplicate, onDelete }: ActionDropdownProps) {
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
