import React, { useState, useRef, useEffect } from 'react';
import { Aircraft, AircraftComponent } from '../../app/maintenance/mockAircraft';

interface RiskMapProps {
  aircraft: Aircraft;
}

const DroneSilhouette = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 stroke-[#6c6a64] dark:stroke-[#a09d96] fill-none" strokeWidth="1" strokeLinejoin="round">
    <circle cx="50" cy="50" r="10" />
    <line x1="50" y1="40" x2="20" y2="20" />
    <line x1="50" y1="60" x2="20" y2="80" />
    <line x1="50" y1="40" x2="80" y2="20" />
    <line x1="50" y1="60" x2="80" y2="80" />
    <circle cx="20" cy="20" r="12" />
    <circle cx="20" cy="80" r="12" />
    <circle cx="80" cy="20" r="12" />
    <circle cx="80" cy="80" r="12" />
  </svg>
);

const CommercialAircraftSilhouette = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 stroke-[#6c6a64] dark:stroke-[#a09d96] fill-none" strokeWidth="1" strokeLinejoin="round">
    <path d="M47,10 Q50,0 53,10 L55,40 L90,55 L90,65 L55,55 L55,85 L70,95 L70,100 L50,95 L30,100 L30,95 L45,85 L45,55 L10,65 L10,55 L45,40 Z" />
    <path d="M40,55 L40,65 M60,55 L60,65" /> {/* engines */}
  </svg>
);

const FighterJetSilhouette = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 stroke-[#6c6a64] dark:stroke-[#a09d96] fill-none" strokeWidth="1" strokeLinejoin="round">
    <path d="M48,15 L50,5 L52,15 L55,30 L85,60 L85,65 L55,55 L55,75 L75,90 L75,95 L55,90 L50,100 L45,90 L25,95 L25,90 L45,75 L45,55 L15,65 L15,60 L45,30 Z" />
  </svg>
);

const GenericAircraftSilhouette = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 stroke-[#6c6a64] dark:stroke-[#a09d96] fill-none" strokeWidth="1" strokeLinejoin="round">
    <path d="M40,20 L50,5 L60,20 L65,40 L90,50 L90,60 L65,55 L60,80 L70,95 L30,95 L40,80 L35,55 L10,60 L10,50 L35,40 Z" />
  </svg>
);

// Distribute points somewhat randomly but centered around the middle for the placeholder
const getComponentPosition = (index: number, total: number) => {
  // A simple deterministic distribution pattern on a 100x100 grid, kept mostly within the bounding shape (20-80 range)
  const angle = (index / total) * Math.PI * 2;
  const radius = 25 + (index % 3) * 5;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { left: `${x}%`, top: `${y}%` };
};

export function RiskMap({ aircraft }: RiskMapProps) {
  const [selectedComp, setSelectedComp] = useState<AircraftComponent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedComp(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSilhouette = () => {
    switch (aircraft.type) {
      case 'Drone': return <DroneSilhouette />;
      case 'Aircraft': return <CommercialAircraftSilhouette />;
      case 'Fighter Jet': return <FighterJetSilhouette />;
      default: return <GenericAircraftSilhouette />;
    }
  };

  const getMarkerColor = (status: string) => {
    if (status === 'Critical') return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
    if (status === 'Watch') return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
  };

  return (
    <div className="w-full h-full flex flex-col relative" ref={containerRef}>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full max-w-md aspect-square">
          {renderSilhouette()}
          
          {aircraft.components.map((comp, idx) => {
            const pos = getComponentPosition(idx, aircraft.components.length);
            const isSelected = selectedComp?.id === comp.id;
            return (
              <button
                key={comp.id}
                data-testid="risk-map-marker"
                onClick={() => setSelectedComp(comp)}
                className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full transition-all duration-200 ${getMarkerColor(comp.status)} ${isSelected ? 'scale-150 ring-2 ring-white/50' : 'hover:scale-125'}`}
                style={{ left: pos.left, top: pos.top }}
                title={comp.name}
              />
            );
          })}
        </div>
      </div>
      
      {/* Popover Report */}
      {selectedComp && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] bg-[#faf9f5] dark:bg-[#161618] border border-[#e6dfd8] dark:border-[#2a2a2b] shadow-xl rounded-xl p-4 z-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#141413] dark:text-[#faf9f5] leading-tight">{selectedComp.name}</h4>
              <span className="text-xs text-[#6c6a64] dark:text-[#a09d96]">{selectedComp.type}</span>
            </div>
            <button onClick={() => setSelectedComp(null)} className="text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              selectedComp.status === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
              selectedComp.status === 'Watch' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              {selectedComp.status}
            </span>
            <span className="text-xs font-medium text-[#141413] dark:text-[#faf9f5] bg-[#efe9de] dark:bg-[#2a2a2b] px-2 py-0.5 rounded">
              RUL: {selectedComp.rul} hrs
            </span>
          </div>
          <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] leading-relaxed mb-3">
            {selectedComp.diagnosticReport}
          </p>
          {selectedComp.actionTimeframe && (
            <div className="pt-3 border-t border-[#e6dfd8] dark:border-[#2a2a2b]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">
                Recommended Action ({selectedComp.actionTimeframe})
              </span>
              <p className="text-xs font-medium text-[#141413] dark:text-[#faf9f5]">
                {selectedComp.recommendedAction}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Overlay label */}
      <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-[#6c6a64]/50 dark:text-[#a09d96]/50 pointer-events-none">
        Risk Topology Map
      </div>
    </div>
  );
}
