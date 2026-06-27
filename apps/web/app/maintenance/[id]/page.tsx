'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { getAircraftById, updateAircraft } from '../../../lib/aircraftStore';
import { Aircraft, AircraftComponent } from '../mockAircraft';
import { ComponentDataEntryTabs } from '../../../components/maintenance/ComponentDataEntryTabs';
import { RiskMap } from '../../../components/maintenance/RiskMap';
import { ChatPanel } from '../../../components/maintenance/ChatPanel';
import { ComponentTable } from '../../../components/maintenance/ComponentTable';
import { MaintenanceCalendar } from '../../../components/maintenance/MaintenanceCalendar';

export default function AircraftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Data Entry State
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newComponents, setNewComponents] = useState<AircraftComponent[]>([
    { id: Math.random().toString(36).substr(2, 9), name: '', type: 'Airframe', rul: 1000, diagnosticReport: '', actionTimeframe: null, recommendedAction: '', hoursUsed: 0, status: 'Healthy' }
  ]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initial load
  useEffect(() => {
    // Need to wait for client-side to access sessionStorage
    const data = getAircraftById(id);
    if (data) {
      setAircraft(data);
    } else {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReAnalyse = () => {
    if (!aircraft) return;
    setIsAnalysing(true);
    setTimeout(() => {
      // Stub: Just trigger a state update to simulate re-analysis
      const updated = { ...aircraft, lastAnalysed: 'Analysed just now' };
      updateAircraft(aircraft.id, updated);
      setAircraft(updated);
      setIsAnalysing(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    setToastMessage('Export started...');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRunAnalysis = () => {
    if (!aircraft) return;
    setIsAnalysing(true);
    setTimeout(() => {
      let finalComponents: AircraftComponent[] = [...aircraft.components];
      let newCritical = aircraft.criticalCount;
      let newWatch = aircraft.watchCount;

      if (activeTab === 'manual') {
        const toAdd = newComponents.filter(c => c.name.trim() !== '').map(c => {
          let rul = 5000;
          let actionTimeframe: any = null;
          let diagnosticReport = "No issues detected. Operating within normal parameters.";
          let recommendedAction = "No action required.";
          if (c.status === 'Critical') {
            rul = 20; actionTimeframe = 'Immediate'; diagnosticReport = "Critical fatigue detected. Immediate action required."; recommendedAction = "Replace immediately.";
          } else if (c.status === 'Watch') {
            rul = 200; actionTimeframe = '30-day'; diagnosticReport = "Minor wear observed. Preventative maintenance suggested."; recommendedAction = "Inspect during next downtime.";
          }
          return { ...c, type: 'Other', rul, diagnosticReport, actionTimeframe, recommendedAction };
        });
        finalComponents = [...toAdd, ...finalComponents];
        newCritical = finalComponents.filter(c => c.status === 'Critical').length;
        newWatch = finalComponents.filter(c => c.status === 'Watch').length;
        
        // Reset manual
        setNewComponents([{ id: Math.random().toString(36).substr(2, 9), name: '', type: 'Airframe', rul: 1000, diagnosticReport: '', actionTimeframe: null, recommendedAction: '', hoursUsed: 0, status: 'Healthy' }]);
      } else {
         // simulate CSV upload
         if (selectedFile) {
            newCritical += 1;
            finalComponents = [{ id: Math.random().toString(36).substr(2, 9), name: `New Sensor`, type: 'Avionics', rul: 15, diagnosticReport: 'Critical fatigue', actionTimeframe: 'Immediate', recommendedAction: 'Replace', hoursUsed: 1200, status: 'Critical' }, ...finalComponents];
            setSelectedFile(null);
         }
      }

      const updated = {
        ...aircraft,
        components: finalComponents,
        criticalCount: newCritical,
        watchCount: newWatch,
        lastAnalysed: 'Analysed just now'
      };
      
      updateAircraft(aircraft.id, updated);
      setAircraft(updated);
      setIsAnalysing(false);
    }, 1500);
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Aircraft not found</h2>
          <button onClick={() => router.push('/maintenance')} className="text-[#cc785c] hover:underline">Return to Fleet Maintenance</button>
        </div>
      </div>
    );
  }

  if (!aircraft) return <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E]"></div>;

  const avgRul = aircraft.components.length > 0 
    ? Math.round(aircraft.components.reduce((acc, c) => acc + (c.rul || 0), 0) / aircraft.components.length)
    : 0;
  const healthyCount = aircraft.components.length - aircraft.criticalCount - aircraft.watchCount;

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-16' : 'pl-[220px]'}`}>
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 gap-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b]">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight">{aircraft.name}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#efe9de]/50 dark:bg-[#161618] text-[#6c6a64] dark:text-[#a09d96] text-[10px] font-bold uppercase tracking-wider">
                {aircraft.type}
              </span>
              <span className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium">{aircraft.totalFlightHours.toLocaleString()} flight hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleReAnalyse} disabled={isAnalysing} className="flex items-center gap-2 px-4 py-2 border border-[#e6dfd8] dark:border-[#2a2a2b] bg-transparent hover:bg-[#efe9de]/50 dark:hover:bg-[#161618] rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                <svg className={`w-4 h-4 ${isAnalysing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Re-analyse</span>
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 border border-[#e6dfd8] dark:border-[#2a2a2b] bg-transparent hover:bg-[#efe9de]/50 dark:hover:bg-[#161618] rounded-lg text-xs font-semibold transition-colors relative">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export PDF</span>
                {toastMessage && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#cc785c] text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                    {toastMessage}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Total Components</span>
              <span className="text-2xl font-serif text-[#141413] dark:text-[#faf9f5]">{aircraft.components.length}</span>
            </div>
            <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Critical</span>
              <span className="text-2xl font-serif text-rose-600 dark:text-rose-400">{aircraft.criticalCount}</span>
            </div>
            <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Watch</span>
              <span className="text-2xl font-serif text-amber-600 dark:text-amber-400">{aircraft.watchCount}</span>
            </div>
            <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Healthy</span>
              <span className="text-2xl font-serif text-emerald-600 dark:text-emerald-400">{healthyCount}</span>
            </div>
            <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-1">Avg RUL</span>
              <span className="text-2xl font-serif text-[#141413] dark:text-[#faf9f5]">{avgRul} <span className="text-sm font-sans text-[#6c6a64] dark:text-[#a09d96]">hrs</span></span>
            </div>
          </div>

          {/* 3-Column Layout */}
          <div className="flex flex-col xl:flex-row gap-6 mb-8 h-auto xl:h-[600px]">
            {/* Left Column: Data Entry */}
            <div className="w-full xl:w-[340px] flex flex-col border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-xl bg-[#faf9f5] dark:bg-[#0C0C0E] shrink-0 overflow-hidden">
              <div className="p-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b] shrink-0">
                <h3 className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">Data Entry</h3>
                <p className="text-[10px] text-[#6c6a64] dark:text-[#a09d96]">Upload or manually add components</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ComponentDataEntryTabs 
                  activeTab={activeTab} setActiveTab={setActiveTab}
                  components={newComponents} setComponents={setNewComponents}
                  selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                  isAnalysing={isAnalysing}
                />
              </div>
              <div className="p-4 border-t border-[#e6dfd8] dark:border-[#2a2a2b] shrink-0">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalysing}
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#cc785c] hover:bg-[#a85b42] disabled:opacity-70 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
                >
                  {isAnalysing ? (
                    <>
                      <svg className="w-3.5 h-3.5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analysing...
                    </>
                  ) : (
                    'Run Analysis'
                  )}
                </button>
              </div>
            </div>

            {/* Center Column: Risk Map */}
            <div className="flex-1 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-xl bg-[#efe9de]/10 dark:bg-[#161618]/10 overflow-hidden relative min-h-[400px]">
              <RiskMap aircraft={aircraft} />
            </div>

            {/* Right Column: Chat Panel */}
            <div className="w-full xl:w-[360px] flex flex-col border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-xl overflow-hidden shrink-0 h-[500px] xl:h-auto">
              <ChatPanel aircraftName={aircraft.name} />
            </div>
          </div>

          {/* Component Table */}
          <ComponentTable components={aircraft.components} />

          {/* Maintenance Calendar */}
          <MaintenanceCalendar components={aircraft.components} />
          
        </main>
      </div>
    </div>
  );
}
