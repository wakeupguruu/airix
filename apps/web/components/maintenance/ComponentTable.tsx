import React, { useState, useMemo } from 'react';
import { AircraftComponent } from '../../app/maintenance/mockAircraft';

interface ComponentTableProps {
  components: AircraftComponent[];
}

type SortField = 'type' | 'rul' | 'status';
type SortDirection = 'asc' | 'desc';

export function ComponentTable({ components }: ComponentTableProps) {
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const sortedComponents = useMemo(() => {
    return [...components].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'rul') {
        comparison = (a.rul || 0) - (b.rul || 0);
      } else if (sortField === 'status') {
        const riskScore = { 'Critical': 3, 'Watch': 2, 'Healthy': 1 };
        comparison = riskScore[b.status] - riskScore[a.status];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [components, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="opacity-0 group-hover:opacity-50">↕</span>;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getBadgeClass = (status: string) => {
    if (status === 'Critical') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
    if (status === 'Watch') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  };

  const getDotClass = (status: string) => {
    if (status === 'Critical') return 'bg-rose-500';
    if (status === 'Watch') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full overflow-hidden border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-xl bg-transparent mt-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#efe9de]/30 dark:bg-[#161618]/30">
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Component Name</th>
              <th 
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] cursor-pointer group hover:text-[#cc785c] transition-colors"
                onClick={() => handleSort('type')}
              >
                Type <span className="ml-1 inline-block w-3">{getSortIcon('type')}</span>
              </th>
              <th 
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] cursor-pointer group hover:text-[#cc785c] transition-colors"
                onClick={() => handleSort('rul')}
              >
                RUL (hrs) <span className="ml-1 inline-block w-3">{getSortIcon('rul')}</span>
              </th>
              <th 
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] cursor-pointer group hover:text-[#cc785c] transition-colors"
                onClick={() => handleSort('status')}
              >
                Risk Level <span className="ml-1 inline-block w-3">{getSortIcon('status')}</span>
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] text-right">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dfd8] dark:divide-[#2a2a2b]">
            {sortedComponents.map((comp) => {
              const isExpanded = expandedRows.has(comp.id);
              return (
                <React.Fragment key={comp.id}>
                  <tr className="hover:bg-[#efe9de]/10 dark:hover:bg-[#161618]/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">
                      {comp.name}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6c6a64] dark:text-[#a09d96]">
                      {comp.type}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#141413] dark:text-[#faf9f5]">
                      {comp.rul}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getBadgeClass(comp.status)}`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${getDotClass(comp.status)} ${comp.status === 'Critical' ? 'animate-pulse' : ''}`} />
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => toggleRow(comp.id)}
                        className="text-xs font-semibold text-[#cc785c] hover:text-[#a85b42] transition-colors inline-flex items-center gap-1 focus:outline-none"
                      >
                        Report
                        <svg className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Row Content */}
                  {isExpanded && (
                    <tr className="bg-[#efe9de]/20 dark:bg-[#161618]/20">
                      <td colSpan={5} className="py-4 px-6 border-t border-[#e6dfd8]/50 dark:border-[#2a2a2b]/50">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Diagnostic Report</span>
                            <p className="text-sm text-[#141413] dark:text-[#faf9f5] leading-relaxed">
                              {comp.diagnosticReport}
                            </p>
                          </div>
                          {comp.actionTimeframe && (
                            <div className="w-1/3 bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-3">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">
                                Recommended Action ({comp.actionTimeframe})
                              </span>
                              <p className="text-sm font-medium text-[#141413] dark:text-[#faf9f5]">
                                {comp.recommendedAction}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {sortedComponents.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#6c6a64] dark:text-[#a09d96] text-sm">
                  No component data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
