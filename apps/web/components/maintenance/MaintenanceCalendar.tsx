import React from 'react';
import { AircraftComponent } from '../../app/maintenance/mockAircraft';

interface MaintenanceCalendarProps {
  components: AircraftComponent[];
}

type TimeframeGroup = {
  title: string;
  timeframe: string;
  accent: string;
  items: AircraftComponent[];
};

export function MaintenanceCalendar({ components }: MaintenanceCalendarProps) {
  const groups: TimeframeGroup[] = [
    {
      title: 'Immediate Action',
      timeframe: 'Immediate',
      accent: 'border-l-rose-500 bg-rose-500/5',
      items: components.filter(c => c.actionTimeframe === 'Immediate')
    },
    {
      title: '30-Day Window',
      timeframe: '30-day',
      accent: 'border-l-amber-500 bg-amber-500/5',
      items: components.filter(c => c.actionTimeframe === '30-day')
    },
    {
      title: '60-Day Window',
      timeframe: '60-day',
      accent: 'border-l-[#cc785c] bg-[#cc785c]/5',
      items: components.filter(c => c.actionTimeframe === '60-day')
    },
    {
      title: '90-Day Window',
      timeframe: '90-day',
      accent: 'border-l-[#6c6a64] bg-[#6c6a64]/5',
      items: components.filter(c => c.actionTimeframe === '90-day')
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-serif text-[#141413] dark:text-[#faf9f5] mb-4">Maintenance Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <div key={group.timeframe} className="flex flex-col">
            <div className={`p-3 border border-[#e6dfd8] dark:border-[#2a2a2b] border-l-4 rounded-lg rounded-l-none ${group.accent} h-full flex flex-col`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#141413] dark:text-[#faf9f5] mb-3">
                {group.title}
              </h4>
              
              <div className="flex flex-col gap-2 flex-grow">
                {group.items.length > 0 ? (
                  group.items.map(comp => (
                    <div key={comp.id} className="bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-md p-2.5 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5] leading-tight pr-2">{comp.name}</span>
                        {comp.status === 'Critical' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#6c6a64] dark:text-[#a09d96] line-clamp-2" title={comp.recommendedAction}>
                        {comp.recommendedAction}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center min-h-[80px]">
                    <span className="text-xs font-medium text-[#6c6a64]/60 dark:text-[#a09d96]/60">No actions required</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
