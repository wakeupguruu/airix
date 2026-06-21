'use client';

import React from 'react';
import {
  ConceptStudioIcon,
  ManualBuilderIcon,
  DirectGenerationIcon,
  PhotoToModelIcon
} from './Icons';

interface CreationModesProps {
  onSelectMode: (modeName: string) => void;
}

export default function CreationModes({ onSelectMode }: CreationModesProps) {
  const modes = [
    {
      name: 'Concept Studio',
      description: 'Generative aerodynamic shaping, wind tunnel styling, and lift optimization.',
      icon: ConceptStudioIcon,
      bgColor: 'hover:border-airix-coral/40 hover:bg-airix-coral/[0.02]',
    },
    {
      name: 'Manual Builder',
      description: 'Precision CAD modeler, structured drafting, and bulkhead arrangement.',
      icon: ManualBuilderIcon,
      bgColor: 'hover:border-airix-coral/40 hover:bg-airix-coral/[0.02]',
    },
    {
      name: 'Direct Generation',
      description: 'Generative text-to-3D coordinates and parametric engine synthesis.',
      icon: DirectGenerationIcon,
      bgColor: 'hover:border-airix-coral/40 hover:bg-airix-coral/[0.02]',
    },
    {
      name: 'Photo to Model',
      description: 'Convert orthographic photos and blueprint sketches into 3D polygon meshes.',
      icon: PhotoToModelIcon,
      bgColor: 'hover:border-airix-coral/40 hover:bg-airix-coral/[0.02]',
    },
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col mb-4">
        <h2 className="font-serif text-xl font-bold text-airix-text tracking-wide">Select Creation Mode</h2>
        <p className="text-xs text-airix-muted font-medium">Start a new project using one of our aviation modules</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modes.map((mode, idx) => {
          const Icon = mode.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectMode(mode.name)}
              className={`flex flex-col text-left p-5 bg-airix-surface border border-airix-border rounded-[12px] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md cursor-pointer group ${mode.bgColor}`}
            >
              {/* Icon container */}
              <div className="mb-4 p-3 bg-airix-bg rounded-lg inline-flex self-start border border-airix-border text-airix-muted group-hover:text-airix-coral transition-colors duration-300">
                <Icon size={24} />
              </div>
              
              {/* Title */}
              <h3 className="font-serif text-lg font-bold text-airix-text mb-2 group-hover:text-airix-coral transition-colors duration-300">
                {mode.name}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-airix-muted leading-relaxed flex-grow">
                {mode.description}
              </p>

              {/* Action indicator */}
              <div className="mt-4 flex items-center space-x-1 text-[11px] font-semibold text-airix-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Launch Studio</span>
                <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
