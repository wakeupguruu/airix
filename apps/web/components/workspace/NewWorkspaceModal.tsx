'use client';

import React, { useState, useEffect } from 'react';
import { Workspace } from '../types';

interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workspace: Omit<Workspace, 'id' | 'lastEdited'>) => void;
  initialMode: string;
}

export default function NewWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
  initialMode
}: NewWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<Workspace['mode']>('Concept Studio');
  const [status, setStatus] = useState<Workspace['status']>('Draft');
  const [error, setError] = useState('');

  // Update mode when modal is opened with an initial mode
  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      if (
        initialMode === 'Concept Studio' ||
        initialMode === 'Manual Builder' ||
        initialMode === 'Direct Generation' ||
        initialMode === 'Photo to Model'
      ) {
        setMode(initialMode);
      } else {
        setMode('Concept Studio');
      }
      setStatus('Draft');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    onCreate({
      name: name.trim(),
      mode,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[#141413]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-airix-surface border border-airix-border rounded-[16px] w-full max-w-md p-6 mx-4 shadow-xl z-50 transform scale-100 transition-all duration-300 ease-out">
        {/* Header */}
        <div className="mb-5 flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-airix-text tracking-wide">
            New Workspace
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-airix-bg rounded text-airix-muted hover:text-airix-text transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-airix-muted mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Supersonic Wing Prototype"
              className="w-full bg-airix-bg border border-airix-border rounded-lg px-3 py-2 text-sm text-airix-text focus:border-airix-coral transition-colors duration-200 font-medium placeholder:text-airix-muted/50"
            />
            {error && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{error}</span>}
          </div>

          {/* Creation Mode */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-airix-muted mb-1.5">
              Creation Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Workspace['mode'])}
              className="w-full bg-airix-bg border border-airix-border rounded-lg px-3 py-2 text-sm text-airix-text focus:border-airix-coral transition-colors duration-200 font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '14px'
              }}
            >
              <option value="Concept Studio">Concept Studio</option>
              <option value="Manual Builder">Manual Builder</option>
              <option value="Direct Generation">Direct Generation</option>
              <option value="Photo to Model">Photo to Model</option>
            </select>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-airix-muted mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Workspace['status'])}
              className="w-full bg-airix-bg border border-airix-border rounded-lg px-3 py-2 text-sm text-airix-text focus:border-airix-coral transition-colors duration-200 font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '14px'
              }}
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Analyzing">Analyzing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-airix-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-airix-border rounded-lg text-xs font-semibold text-airix-muted hover:text-airix-text hover:bg-airix-bg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-airix-coral hover:bg-airix-hover rounded-lg text-xs font-semibold text-white transition-colors duration-200"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
