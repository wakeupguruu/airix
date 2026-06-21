'use client';

import React from 'react';
import { AircraftBlueprintIllustration, RefreshIcon } from './Icons';

interface EmptyStateProps {
  onResetDefaults?: () => void;
}

export default function EmptyState({ onResetDefaults }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-airix-surface border border-dashed border-airix-border rounded-[12px] text-center max-w-2xl mx-auto my-8">
      {/* Aircraft Outline Illustration */}
      <div className="w-full max-w-sm mb-6 text-airix-muted opacity-80">
        <AircraftBlueprintIllustration className="w-full h-auto" />
      </div>

      {/* Typography */}
      <h3 className="font-serif text-2xl font-bold text-airix-text mb-2 tracking-wide">
        No Workspaces Yet
      </h3>
      <p className="text-sm text-airix-muted max-w-md mb-6 leading-relaxed">
        Start by selecting a creation mode above to initialize a new aircraft design project, or search for another term.
      </p>

      {/* Action button if they want to restore default mockups */}
      {onResetDefaults && (
        <button
          onClick={onResetDefaults}
          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-airix-coral hover:text-airix-hover border border-airix-coral/30 hover:border-airix-hover/40 bg-airix-bg hover:bg-airix-surface rounded-lg transition-all duration-200"
        >
          <RefreshIcon size={14} />
          <span>Restore Demo Projects</span>
        </button>
      )}
    </div>
  );
}
