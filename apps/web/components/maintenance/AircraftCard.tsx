import React from 'react';
import Link from 'next/link';
import { Aircraft } from '../../app/maintenance/mockAircraft';

interface AircraftCardProps {
  aircraft: Aircraft;
}

export function AircraftCard({ aircraft }: AircraftCardProps) {
  return (
    <div className="group relative flex flex-col justify-between p-5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] hover:-translate-y-0.5 hover:border-[#cc785c]/40 transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-base text-[#141413] dark:text-[#faf9f5] font-medium leading-tight">
            {aircraft.name}
          </h3>
          <span className="ml-3 shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#efe9de]/50 dark:bg-[#161618] text-[#6c6a64] dark:text-[#a09d96] border border-[#e6dfd8] dark:border-[#2a2a2b]">
            {aircraft.type}
          </span>
        </div>
        
        <div className="flex flex-col space-y-3 mb-6">
          <div className="text-xs text-[#6c6a64] dark:text-[#a09d96]">
            {aircraft.totalFlightHours.toLocaleString()} hrs
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {aircraft.criticalCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded border border-rose-500/20 bg-rose-500/5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                {aircraft.criticalCount} Critical
              </span>
            )}
            
            {aircraft.watchCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                {aircraft.watchCount} Watch
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#e6dfd8] dark:border-[#2a2a2b] flex items-center justify-between">
          <span className="text-xs text-[#6c6a64] dark:text-[#a09d96]">
            {aircraft.lastAnalysed}
          </span>
          <Link 
            href={`/maintenance/${aircraft.id}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[#e6dfd8] dark:border-[#2a2a2b] text-[#141413] dark:text-[#faf9f5] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors"
          >
            Open &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
