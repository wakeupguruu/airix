import React from 'react';

export interface EmptyStateProps {
  onResetDefaults?: () => void;
  title?: string;
  description?: string;
}

export function EmptyState({ 
  onResetDefaults, 
  title = "No projects found",
  description = "Start creating your custom aerodynamic profiles, structured draftings, or 3D meshes using our builder modules."
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] bg-transparent text-center">
      <div className="mb-6 text-[#6c6a64] dark:text-[#a09d96] opacity-60">
        <svg className="w-12 h-12 mx-auto stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M9 9l6 6M15 9l-6 6"></path>
        </svg>
      </div>
      <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onResetDefaults && (
        <button
          onClick={onResetDefaults}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-[#cc785c] hover:bg-[#cc785c]/5 text-[#cc785c] font-semibold text-xs rounded-md transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset Demo Workspaces</span>
        </button>
      )}
    </div>
  );
}
