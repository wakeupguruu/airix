'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { CustomDropdown } from '../../components/CustomDropdown';
import { GridViewIcon, ListViewIcon, SearchIcon, PlusIcon } from '../../components/workspace/Icons';
import { EmptyState } from '../../components/workspace/EmptyState';
import { Pagination } from '../../components/shared/Pagination';
import { AircraftCard } from '../../components/maintenance/AircraftCard';
import { AircraftListRow } from '../../components/maintenance/AircraftListRow';
import { AddAircraftPanel } from '../../components/maintenance/AddAircraftPanel';
import { getAllAircraft } from '../../lib/aircraftStore';
import { Aircraft } from './mockAircraft';

const ITEMS_PER_PAGE = 12;

export default function MaintenancePage() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const sortOptions = ['Last updated', 'Name', 'Risk level (Critical first)'];
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data State
  const [allAircraft, setAllAircraft] = useState<Aircraft[]>([]);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load data on mount and when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setAllAircraft(getAllAircraft());
    }
  }, [isModalOpen]);

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...allAircraft];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sortBy === 'Name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'Risk level (Critical first)') {
        if (a.criticalCount !== b.criticalCount) {
          return b.criticalCount - a.criticalCount;
        }
        return b.watchCount - a.watchCount;
      }
      // 'Last updated' is default (assume array order for now as mock data is static)
      return 0;
    });

    return result;
  }, [allAircraft, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  
  // Reset pagination if filtered results shrink
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedItems = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-16' : 'pl-[220px]'}`}>
        <main className="flex-1 p-6 md:p-8 pb-28 max-w-7xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight">Fleet Maintenance</h1>
              <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] mt-1.5 font-medium">Monitor and predict the health of your aircraft and drones</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Grid / List View Toggle */}
              <div className="flex bg-[#efe9de]/50 dark:bg-[#161618] p-1 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-[#faf9f5] dark:bg-[#2a2a2b] text-[#141413] dark:text-[#faf9f5] shadow-sm' 
                      : 'text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5]'
                  }`}
                  aria-label="Grid view"
                >
                  <GridViewIcon />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-[#faf9f5] dark:bg-[#2a2a2b] text-[#141413] dark:text-[#faf9f5] shadow-sm' 
                      : 'text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5]'
                  }`}
                  aria-label="List view"
                >
                  <ListViewIcon />
                </button>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#cc785c] hover:bg-[#a85b42] text-white rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm"
              >
                <PlusIcon size={16} />
                <span>Add Aircraft</span>
              </button>
            </div>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-[#6c6a64] dark:text-[#a09d96]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search aircraft by name..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all outline-none placeholder:text-[#6c6a64]/60 dark:placeholder:text-[#a09d96]/60"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Sort</span>
              <CustomDropdown
                options={sortOptions}
                value={sortBy}
                onChange={(val) => {
                  setSortBy(val);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full">
            {paginatedItems.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {paginatedItems.map(aircraft => (
                      <AircraftCard key={aircraft.id} aircraft={aircraft} />
                    ))}
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-xl bg-transparent">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#efe9de]/30 dark:bg-[#161618]/30">
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Name</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Type</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Flight Hours</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Critical</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Watch</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">Last Analysed</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map((aircraft) => (
                          <AircraftListRow key={aircraft.id} aircraft={aircraft} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Fixed Pagination Bar */}
                {totalPages > 1 && (
                  <div className={`fixed bottom-0 right-0 z-20 bg-[#faf9f5] dark:bg-[#0C0C0E] border-t border-[#e6dfd8] dark:border-[#2a2a2b] transition-all duration-300 ease-in-out px-6 md:px-8 py-4 flex items-center justify-center ${isCollapsed ? 'left-16' : 'left-[220px]'}`}>
                    <div className="w-full max-w-7xl mx-auto">
                      <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        totalItems={filteredAndSorted.length} 
                        itemsPerPage={ITEMS_PER_PAGE} 
                        onPageChange={setCurrentPage} 
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState 
                title="No aircraft added yet" 
                description="Try a different search or filter" 
                actionButton={
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 mt-4 bg-[#cc785c] hover:bg-[#a85b42] text-white rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm"
                  >
                    <PlusIcon size={16} />
                    <span>Add Aircraft</span>
                  </button>
                } 
              />
            )}
          </div>
        </main>
      </div>
      
      {/* Slide-in Add Aircraft Modal */}
      <AddAircraftPanel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
