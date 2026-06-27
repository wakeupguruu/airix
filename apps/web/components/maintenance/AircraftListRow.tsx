import React from 'react';
import Link from 'next/link';
import { Aircraft } from '../../app/maintenance/mockAircraft';

interface AircraftListRowProps {
  aircraft: Aircraft;
}

export function AircraftListRow({ aircraft }: AircraftListRowProps) {
  return (
    <tr className="group border-b border-[#e6dfd8] dark:border-[#2a2a2b] hover:bg-[#efe9de]/30 dark:hover:bg-[#161618]/30 transition-colors">
      <td className="py-4 px-4 align-middle">
        <span className="font-serif text-sm font-medium text-[#141413] dark:text-[#faf9f5]">
          {aircraft.name}
        </span>
      </td>
      <td className="py-4 px-4 align-middle">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#efe9de]/50 dark:bg-[#161618] text-[#6c6a64] dark:text-[#a09d96] border border-[#e6dfd8] dark:border-[#2a2a2b]">
          {aircraft.type}
        </span>
      </td>
      <td className="py-4 px-4 align-middle text-sm text-[#6c6a64] dark:text-[#a09d96]">
        {aircraft.totalFlightHours.toLocaleString()} hrs
      </td>
      <td className="py-4 px-4 align-middle">
        {aircraft.criticalCount > 0 ? (
          <span className="inline-flex items-center px-2 py-1 rounded border border-rose-500/20 bg-rose-500/5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
            {aircraft.criticalCount} Critical
          </span>
        ) : (
          <span className="text-sm text-[#6c6a64] dark:text-[#a09d96]">&mdash;</span>
        )}
      </td>
      <td className="py-4 px-4 align-middle">
        {aircraft.watchCount > 0 ? (
          <span className="inline-flex items-center px-2 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            {aircraft.watchCount} Watch
          </span>
        ) : (
          <span className="text-sm text-[#6c6a64] dark:text-[#a09d96]">&mdash;</span>
        )}
      </td>
      <td className="py-4 px-4 align-middle text-xs text-[#6c6a64] dark:text-[#a09d96]">
        {aircraft.lastAnalysed}
      </td>
      <td className="py-4 px-4 align-middle text-right">
        <Link 
          href={`/maintenance/${aircraft.id}`}
          className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md border border-[#e6dfd8] dark:border-[#2a2a2b] text-[#141413] dark:text-[#faf9f5] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors"
        >
          Open &rarr;
        </Link>
      </td>
    </tr>
  );
}
