import React from 'react';

export const getModeBadgeClass = (mode: string) => {
  switch (mode) {
    case 'Concept Studio':
      return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20';
    case 'Blank Workspace':
      return 'bg-neutral-500/10 text-neutral-600 dark:bg-neutral-500/20 dark:text-neutral-400 border-neutral-500/20';
    case 'Text → 3D':
      return 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20';
    case 'Image → 3D':
      return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-[#efe9de]/35 dark:bg-[#161618]/35 text-[#6c6a64] dark:text-[#a09d96] border-[#e6dfd8] dark:border-[#2a2a2b]';
  }
};

export const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'Active':
      return (
        <span className="inline-flex w-fit items-center text-[10px] font-semibold text-[#cc785c] bg-[#cc785c]/5 px-2 py-0.5 rounded-full border border-[#cc785c]/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c] mr-1.5" />
          Active
        </span>
      );
    case 'Analyzing':
      return (
        <span className="inline-flex w-fit items-center text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          Analyzing
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex w-fit items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex w-fit items-center text-[10px] font-semibold text-[#6c6a64] dark:text-[#a09d96] bg-[#efe9de]/30 dark:bg-[#161618]/30 px-2 py-0.5 rounded-full border border-[#e6dfd8] dark:border-[#2a2a2b]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6c6a64] dark:bg-[#a09d96] mr-1.5 opacity-50" />
          Draft
        </span>
      );
  }
};
