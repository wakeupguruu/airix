import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomDropdown } from '../CustomDropdown';
import { Aircraft, AircraftComponent } from '../../app/maintenance/mockAircraft';
import { addAircraft } from '../../lib/aircraftStore';
import { ComponentDataEntryTabs } from './ComponentDataEntryTabs';

interface AddAircraftPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAircraftPanel({ isOpen, onClose }: AddAircraftPanelProps) {
  const router = useRouter();
  
  // Basic Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Aircraft');
  const [flightHours, setFlightHours] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  
  // CSV Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Manual Entry State
  const [components, setComponents] = useState<AircraftComponent[]>([
    { id: Math.random().toString(36).substr(2, 9), name: '', type: 'Airframe', rul: 1000, diagnosticReport: '', actionTimeframe: null, recommendedAction: '', hoursUsed: 0, status: 'Healthy' }
  ]);
  
  // Loading State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Aircraft name is required.');
      return;
    }

    setIsAnalysing(true);
    
    // Simulate API call and prediction logic
    setTimeout(() => {
      let criticalCount = 0;
      let watchCount = 0;
      let finalComponents: AircraftComponent[] = [];
      
      if (activeTab === 'manual') {
        finalComponents = components.filter(c => c.name.trim() !== '').map(c => {
          // Add default fields for newly created manual components
          let rul = 5000;
          let actionTimeframe: any = null;
          let diagnosticReport = "No issues detected. Operating within normal parameters.";
          let recommendedAction = "No action required.";
          
          if (c.status === 'Critical') {
            rul = 20;
            actionTimeframe = 'Immediate';
            diagnosticReport = "Critical fatigue detected. Immediate action required.";
            recommendedAction = "Replace immediately.";
          } else if (c.status === 'Watch') {
            rul = 200;
            actionTimeframe = '30-day';
            diagnosticReport = "Minor wear observed. Preventative maintenance suggested.";
            recommendedAction = "Inspect during next downtime.";
          }

          return {
            ...c,
            type: 'Other',
            rul,
            diagnosticReport,
            actionTimeframe,
            recommendedAction
          };
        });
        criticalCount = finalComponents.filter(c => c.status === 'Critical').length;
        watchCount = finalComponents.filter(c => c.status === 'Watch').length;
      } else {
        // If CSV is used, generate a mock prediction
        if (selectedFile) {
          criticalCount = Math.floor(Math.random() * 3);
          watchCount = Math.floor(Math.random() * 4);
          
          // Generate mock components for CSV
          for (let i = 0; i < criticalCount; i++) {
            finalComponents.push({ id: Math.random().toString(36).substr(2, 9), name: `Turbine ${i+1}`, type: 'Engine', rul: 15, diagnosticReport: 'Critical fatigue', actionTimeframe: 'Immediate', recommendedAction: 'Replace', hoursUsed: 1200, status: 'Critical' });
          }
          for (let i = 0; i < watchCount; i++) {
            finalComponents.push({ id: Math.random().toString(36).substr(2, 9), name: `Sensor ${i+1}`, type: 'Avionics', rul: 150, diagnosticReport: 'Minor wear', actionTimeframe: '30-day', recommendedAction: 'Inspect', hoursUsed: 800, status: 'Watch' });
          }
          for (let i = 0; i < 3; i++) {
            finalComponents.push({ id: Math.random().toString(36).substr(2, 9), name: `Panel ${i+1}`, type: 'Airframe', rul: 5000, diagnosticReport: 'No issues', actionTimeframe: null, recommendedAction: 'None', hoursUsed: 400, status: 'Healthy' });
          }
        }
      }

      const newAircraft: Aircraft = {
        id: `ac-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        type,
        totalFlightHours: Number(flightHours) || 0,
        criticalCount,
        watchCount,
        lastAnalysed: 'Analysed just now',
        components: finalComponents
      };
      
      addAircraft(newAircraft);
      setIsAnalysing(false);
      onClose();
      router.push(`/maintenance/${newAircraft.id}`);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#141413]/40 dark:bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
        onClick={() => !isAnalysing && onClose()}
      />
      
      {/* Slide-in Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[520px] bg-[#faf9f5] dark:bg-[#0C0C0E] border-l border-[#e6dfd8] dark:border-[#2a2a2b] shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b] shrink-0">
          <h2 className="font-serif text-2xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight">Add Aircraft</h2>
          <button 
            onClick={onClose}
            disabled={isAnalysing}
            className="p-2 text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 text-sm text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                  Aircraft Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Phantom Recon Drone"
                  className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all outline-none"
                  disabled={isAnalysing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                    Type
                  </label>
                  <CustomDropdown
                    options={['Drone', 'Aircraft', 'Fighter Jet', 'Other']}
                    value={type}
                    onChange={setType}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                    Total Flight Hours
                  </label>
                  <input 
                    type="number"
                    value={flightHours}
                    onChange={(e) => setFlightHours(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0"
                    className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all outline-none"
                    disabled={isAnalysing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1.5">
                  Description (Optional)
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes or details..."
                  className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all outline-none min-h-[80px] resize-none"
                  disabled={isAnalysing}
                />
              </div>
            </div>

            {/* Component Data Tabs */}
            <div className="pt-2 border-t border-[#e6dfd8] dark:border-[#2a2a2b]">
              <h3 className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5] mb-4">Add Component Data</h3>
              <ComponentDataEntryTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                components={components}
                setComponents={setComponents}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                isAnalysing={isAnalysing}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#faf9f5]/50 dark:bg-[#0C0C0E]/50 sticky bottom-0">
            <button
              type="submit"
              disabled={isAnalysing}
              className="w-full flex items-center justify-center px-4 py-3 bg-[#cc785c] hover:bg-[#a85b42] disabled:opacity-70 rounded-lg text-sm font-semibold text-white transition-all shadow-sm"
            >
              {isAnalysing ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analysing...
                </>
              ) : (
                'Create & Analyse'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
