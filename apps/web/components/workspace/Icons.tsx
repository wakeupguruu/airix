import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 1. Concept Studio: Aerodynamic supersonic wing profile with airflow streamlines
export const ConceptStudioIcon = ({ size = 32, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Airflow stream lines */}
    <path d="M4 14C12 14 18 10 24 10C30 10 36 14 44 14" strokeDasharray="2 2" className="opacity-40" />
    <path d="M4 24C10 24 16 18 24 18C32 18 38 24 44 24" />
    <path d="M4 34C12 34 18 28 24 28C30 28 36 34 44 34" strokeDasharray="2 2" className="opacity-40" />
    {/* Aerodynamic wing foil cross-section */}
    <path
      d="M12 28C10 26 9.5 22 13 19.5C18 16 28 17.5 36 21C38 21.8 40 23 38 24.5C35 26.5 24 30.5 16 30C14 29.8 13 29 12 28Z"
      fill="currentColor"
      fillOpacity={0.08}
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

// 2. Manual Builder: Drafting blueprint grid with dividers/compass and straight lines
export const ManualBuilderIcon = ({ size = 32, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Blueprint drafting grids */}
    <rect x="6" y="6" width="36" height="36" rx="3" strokeWidth={1} className="opacity-30" />
    <line x1="18" y1="6" x2="18" y2="42" strokeWidth={1} strokeDasharray="3 3" className="opacity-25" />
    <line x1="30" y1="6" x2="30" y2="42" strokeWidth={1} strokeDasharray="3 3" className="opacity-25" />
    <line x1="6" y1="18" x2="42" y2="18" strokeWidth={1} strokeDasharray="3 3" className="opacity-25" />
    <line x1="6" y1="30" x2="42" y2="30" strokeWidth={1} strokeDasharray="3 3" className="opacity-25" />
    {/* Drafting Compass (divider) */}
    <path d="M24 8L15 36M24 8L33 36" strokeWidth={2} />
    <circle cx="24" cy="8" r="2" fill="currentColor" />
    <path d="M19 24H29" />
    <path d="M18 20L19 28M30 20L29 28" className="opacity-60" />
  </svg>
);

// 3. Direct Generation: Generative particles/mesh, 3D axes, and aircraft nose cone model
export const DirectGenerationIcon = ({ size = 32, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* 3D coordinate box corners */}
    <path d="M6 16L24 6L42 16V32L24 42L6 32V16Z" className="opacity-30" strokeDasharray="2 2" />
    <line x1="24" y1="6" x2="24" y2="42" className="opacity-25" />
    <line x1="6" y1="16" x2="42" y2="32" className="opacity-25" />
    <line x1="42" y1="16" x2="6" y2="32" className="opacity-25" />
    {/* 3D Wireframe aircraft nose/propeller */}
    <path d="M24 16L32 30L24 26L16 30L24 16Z" fill="currentColor" fillOpacity={0.08} strokeWidth={2} />
    <line x1="24" y1="16" x2="24" y2="26" strokeWidth={1.5} />
    <circle cx="24" cy="16" r="3" fill="currentColor" />
    <circle cx="32" cy="30" r="3" fill="currentColor" />
    <circle cx="16" cy="30" r="3" fill="currentColor" />
  </svg>
);

// 4. Photo to Model: Camera shutter transitioning to 3D orthographic projection lines
export const PhotoToModelIcon = ({ size = 32, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Photo frame corners */}
    <path d="M8 14V8H14M34 8H40V14M40 34V40H34M14 40H8V34" className="opacity-40" />
    {/* Camera shape */}
    <rect x="12" y="16" width="24" height="18" rx="2" strokeWidth={1.5} />
    <path d="M20 16V13H28V16" strokeWidth={1.5} />
    <circle cx="24" cy="25" r="5" strokeWidth={1.5} />
    {/* Shutter projection lines to model */}
    <path d="M12 20L4 24M36 20L44 24M24 34L24 42" strokeDasharray="2 2" className="opacity-55" />
    <circle cx="24" cy="25" r="1.5" fill="currentColor" />
  </svg>
);

// Empty State: Beautiful aircraft technical drawing blueprint
// eslint-disable-next-line react/prop-types
export const AircraftBlueprintIllustration = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 300 160"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Grid Background */}
    <g className="opacity-15" stroke="currentColor" strokeWidth={0.5}>
      <line x1="0" y1="20" x2="300" y2="20" />
      <line x1="0" y1="40" x2="300" y2="40" />
      <line x1="0" y1="60" x2="300" y2="60" />
      <line x1="0" y1="80" x2="300" y2="80" />
      <line x1="0" y1="100" x2="300" y2="100" />
      <line x1="0" y1="120" x2="300" y2="120" />
      <line x1="0" y1="140" x2="300" y2="140" />
      
      <line x1="30" y1="0" x2="30" y2="160" />
      <line x1="60" y1="0" x2="60" y2="160" />
      <line x1="90" y1="0" x2="90" y2="160" />
      <line x1="120" y1="0" x2="120" y2="160" />
      <line x1="150" y1="0" x2="150" y2="160" strokeWidth={1} strokeDasharray="3 3" />
      <line x1="180" y1="0" x2="180" y2="160" />
      <line x1="210" y1="0" x2="210" y2="160" />
      <line x1="240" y1="0" x2="240" y2="160" />
      <line x1="270" y1="0" x2="270" y2="160" />
    </g>

    {/* Technical labels */}
    <text x="10" y="20" fill="currentColor" fontSize="7" fontFamily="monospace" className="opacity-45">AIRIX DESIGN STUDIO</text>
    <text x="10" y="30" fill="currentColor" fontSize="6" fontFamily="monospace" className="opacity-45">MODEL Ref: AX-400 SUPERSONIC</text>
    <text x="235" y="145" fill="currentColor" fontSize="6" fontFamily="monospace" className="opacity-45">SCALE: 1:150</text>
    <text x="235" y="153" fill="currentColor" fontSize="6" fontFamily="monospace" className="opacity-45">STAGE: PROTOTYPE</text>

    {/* Aircraft Top-Down Silhouette Outline */}
    <g className="opacity-75" strokeWidth={1.2}>
      {/* Center fuselage line */}
      <line x1="70" y1="80" x2="230" y2="80" strokeDasharray="5 3" className="opacity-45" />

      {/* Main Fuselage */}
      <path d="M75 80C90 75 110 74 130 74C150 74 200 76 215 78L225 76V84L215 82C200 84 150 86 130 86C110 86 90 85 75 80Z" fill="currentColor" fillOpacity={0.03} />

      {/* Cockpit canopy */}
      <path d="M98 78C103 77 112 77 117 78C117 78 114 80 108 80C102 80 98 78 98 78Z" fill="currentColor" />

      {/* Main Swept Wings */}
      <path d="M125 74L190 30L200 30L175 75" fill="currentColor" fillOpacity={0.06} />
      <path d="M125 86L190 130L200 130L175 85" fill="currentColor" fillOpacity={0.06} />

      {/* Horizontal stabilizers (Tail wings) */}
      <path d="M210 78L224 55L228 55L221 78" />
      <path d="M210 82L224 105L228 105L221 82" />

      {/* Jet Engines */}
      <rect x="150" y="69" width="22" height="4" rx="1" />
      <rect x="150" y="87" width="22" height="4" rx="1" />

      {/* Dimension Helper Lines */}
      <g strokeWidth={0.8} className="opacity-40" strokeDasharray="1 1">
        {/* Wingspan dimension */}
        <line x1="200" y1="30" x2="200" y2="130" />
        {/* Length dimension */}
        <line x1="75" y1="140" x2="225" y2="140" />
      </g>
      <g strokeWidth={0.8} className="opacity-60">
        {/* Arrows for wingspan */}
        <path d="M200 35L198 30L202 30" fill="currentColor" />
        <path d="M200 125L198 130L202 130" fill="currentColor" />
        
        {/* Arrows for length */}
        <path d="M80 140L75 138V142Z" fill="currentColor" />
        <path d="M220 140L225 138V142Z" fill="currentColor" />
      </g>
    </g>
  </svg>
);

// Blueprint project thumbnails (Grid / List card visual placeholders)
export const BlueprintThumbnail = ({ projectType = 'jet', className }: { projectType?: string; className?: string }) => {
  return (
    <div className={`relative w-full h-full bg-[#e3dcd1]/70 overflow-hidden border-b border-airix-border flex items-center justify-center ${className}`}>
      {/* Blueprint Grid Lines */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#141413_1px,transparent_1px),linear-gradient(to_bottom,#141413_1px,transparent_1px)] bg-[size:16px_16px]" />
      
      {/* Blueprint Content */}
      <svg
        viewBox="0 0 160 100"
        fill="none"
        stroke="#141413"
        strokeWidth={1}
        className="w-11/12 h-11/12 opacity-65 text-airix-text"
      >
        {projectType === 'Concept Studio' || projectType === 'concept' ? (
          // Slept-back Supersonic Fighter Jet silhouette
          <g>
            <path d="M20 50C40 48 60 48 80 48L110 25L118 25L100 49C120 50 130 50 140 49L144 42H147L143 50L147 50L143 51L147 58H144L140 51C130 50 120 50 100 51L118 75L110 75L80 52C60 52 40 52 20 50Z" fill="currentColor" fillOpacity={0.03} />
            <line x1="15" y1="50" x2="148" y2="50" strokeDasharray="3 3" className="opacity-30" />
            <circle cx="50" cy="50" r="15" strokeDasharray="2 2" className="opacity-25" />
          </g>
        ) : projectType === 'Manual Builder' || projectType === 'manual' ? (
          // Classic Propeller biplane silhouette
          <g>
            <path d="M30 50L60 44L120 47L135 44V56L120 53L60 56Z" fill="currentColor" fillOpacity={0.03} />
            {/* Top wing */}
            <rect x="52" y="20" width="12" height="60" rx="1.5" transform="rotate(90 52 20)" fill="currentColor" fillOpacity={0.05} />
            {/* Bottom wing */}
            <rect x="68" y="28" width="8" height="44" rx="1" transform="rotate(90 68 28)" fill="currentColor" fillOpacity={0.05} />
            <circle cx="30" cy="50" r="8" strokeDasharray="2 2" className="opacity-25" />
            <line x1="22" y1="35" x2="22" y2="65" /> {/* Propeller blade */}
          </g>
        ) : projectType === 'Direct Generation' || projectType === 'generative' ? (
          // Futuristic quadcopter/drone blueprint
          <g>
            {/* Core Body */}
            <circle cx="80" cy="50" r="14" fill="currentColor" fillOpacity={0.05} />
            <circle cx="80" cy="50" r="6" />
            {/* Four Rotors */}
            <line x1="50" y1="20" x2="110" y2="80" strokeWidth={1.5} />
            <line x1="50" y1="80" x2="110" y2="20" strokeWidth={1.5} />
            {/* Rotor guards */}
            <circle cx="50" cy="20" r="8" strokeDasharray="2 2" />
            <circle cx="110" cy="80" r="8" strokeDasharray="2 2" />
            <circle cx="50" cy="80" r="8" strokeDasharray="2 2" />
            <circle cx="110" cy="20" r="8" strokeDasharray="2 2" />
          </g>
        ) : (
          // Photo to Model - Commercial Jet silhouette
          <g>
            <path d="M15 50C35 47 65 46 95 47L110 15L120 15L108 48C125 49 135 50 145 49L150 43V57L145 51C135 50 125 51 108 52L120 85L110 85L95 53C65 54 35 53 15 50Z" fill="currentColor" fillOpacity={0.03} />
            <line x1="10" y1="50" x2="152" y2="50" strokeDasharray="3 3" className="opacity-30" />
            <rect x="70" y="40" width="40" height="20" rx="10" strokeDasharray="1 1" className="opacity-25" />
          </g>
        )}
      </svg>
    </div>
  );
};

// General UI Icons
export const SearchIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const PlusIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export const MoreVerticalIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const GridViewIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

export const ListViewIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth={2.5} />
  </svg>
);

export const ChevronLeftIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const SidebarIconDashboard = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="20" height="20" x="2" y="2" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

export const SidebarIconProjects = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path d="M2 10h20" />
  </svg>
);

export const SidebarIconStudio = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

export const SidebarIconAnalytics = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

export const SidebarIconSettings = ({ size = 20, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EditIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const CopyIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const TrashIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

export const RefreshIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);
