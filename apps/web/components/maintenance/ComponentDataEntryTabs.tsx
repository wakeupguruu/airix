import React, { useRef, useState, useEffect } from 'react';
import { AircraftComponent, ComponentStatus } from '../../app/maintenance/mockAircraft';
import { CustomDropdown } from '../CustomDropdown';

export function StatusDropdown({ value, onChange, disabled }: { value: ComponentStatus, onChange: (val: ComponentStatus) => void, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400';
      case 'Watch':
        return 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400';
      case 'Critical':
        return 'border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400';
      default:
        return 'border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#efe9de]/50 dark:bg-[#161618] text-[#6c6a64] dark:text-[#a09d96]';
    }
  };

  const getDotClass = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500';
      case 'Watch': return 'bg-amber-500';
      case 'Critical': return 'bg-rose-500';
      default: return 'bg-[#6c6a64]';
    }
  };

  return (
    <div className="relative h-[28px]" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between px-2 py-1 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded outline-none focus:border-[#cc785c] disabled:opacity-50"
      >
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold ${getBadgeClass(value)}`}>
          <span className={`w-1 h-1 rounded-full mr-1 ${getDotClass(value)} ${value === 'Critical' ? 'animate-pulse' : ''}`} />
          {value}
        </span>
        <svg className="w-3 h-3 text-[#6c6a64] dark:text-[#a09d96] ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[100px] bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded shadow-lg py-1 left-0">
          {(['Healthy', 'Watch', 'Critical'] as ComponentStatus[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors"
            >
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold ${getBadgeClass(opt)}`}>
                <span className={`w-1 h-1 rounded-full mr-1 ${getDotClass(opt)} ${opt === 'Critical' ? 'animate-pulse' : ''}`} />
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ComponentDataEntryTabsProps {
  activeTab: 'csv' | 'manual';
  setActiveTab: (tab: 'csv' | 'manual') => void;
  components: AircraftComponent[];
  setComponents: (comps: AircraftComponent[]) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isAnalysing: boolean;
}

export function ComponentDataEntryTabs({
  activeTab,
  setActiveTab,
  components,
  setComponents,
  selectedFile,
  setSelectedFile,
  isAnalysing
}: ComponentDataEntryTabsProps) {

  const handleAddComponentRow = () => {
    setComponents([
      ...components, 
      { id: Math.random().toString(36).substr(2, 9), name: '', type: 'Airframe', rul: 1000, diagnosticReport: '', actionTimeframe: null, recommendedAction: '', hoursUsed: 0, status: 'Healthy' }
    ]);
  };

  const handleRemoveComponentRow = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const updateComponent = (id: string, field: keyof AircraftComponent, value: any) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files.item(0) || null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files.item(0) || null);
    }
  };

  return (
    <>
      <div className="flex border-b border-[#e6dfd8] dark:border-[#2a2a2b] mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
            activeTab === 'csv' 
              ? 'border-[#cc785c] text-[#141413] dark:text-[#faf9f5]' 
              : 'border-transparent text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5]'
          }`}
        >
          CSV/XLSX Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
            activeTab === 'manual' 
              ? 'border-[#cc785c] text-[#141413] dark:text-[#faf9f5]' 
              : 'border-transparent text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5]'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {activeTab === 'csv' ? (
        <div 
          className="border-2 border-dashed border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-[#cc785c]/50 transition-colors bg-[#efe9de]/10 dark:bg-[#161618]/10 group relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center z-10 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5] mb-1">
                ✓ File ready
              </div>
              <div className="text-xs text-[#6c6a64] dark:text-[#a09d96] flex items-center gap-2">
                <span>{selectedFile.name}</span>
                <button 
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-rose-500 hover:text-rose-600 transition-colors bg-rose-500/10 rounded-full p-0.5"
                  title="Remove file"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                accept=".csv,.xlsx" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileSelect}
                disabled={isAnalysing}
              />
              <svg className="w-8 h-8 text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">Click to upload</span>
              <span className="text-xs text-[#6c6a64] dark:text-[#a09d96] mt-1">or drag and drop .csv or .xlsx</span>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 px-1">
            <div className="col-span-5 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Component Name</div>
            <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Hours</div>
            <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Status</div>
          </div>
          
          {components.map((comp) => (
            <div key={comp.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <input 
                  type="text"
                  value={comp.name}
                  onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                  placeholder="e.g. Rotor Blade"
                  className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded px-2 py-1.5 text-xs text-[#141413] dark:text-[#faf9f5] outline-none focus:border-[#cc785c]"
                  disabled={isAnalysing}
                />
              </div>
              <div className="col-span-3">
                <input 
                  type="number"
                  value={comp.hoursUsed || ''}
                  onChange={(e) => updateComponent(comp.id, 'hoursUsed', Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded px-2 py-1.5 text-xs text-[#141413] dark:text-[#faf9f5] outline-none focus:border-[#cc785c]"
                  disabled={isAnalysing}
                />
              </div>
              <div className="col-span-3">
                <StatusDropdown 
                  value={comp.status}
                  onChange={(val) => updateComponent(comp.id, 'status', val)}
                  disabled={isAnalysing}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button 
                  type="button" 
                  onClick={() => handleRemoveComponentRow(comp.id)}
                  className="p-1.5 text-[#6c6a64] dark:text-[#a09d96] hover:text-rose-500 transition-colors disabled:opacity-50"
                  disabled={components.length === 1 || isAnalysing}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          <button 
            type="button"
            onClick={handleAddComponentRow}
            disabled={isAnalysing}
            className="mt-3 flex items-center text-xs font-semibold text-[#cc785c] hover:text-[#a85b42] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Component Row
          </button>
        </div>
      )}
    </>
  );
}
