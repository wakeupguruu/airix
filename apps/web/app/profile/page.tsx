'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ProfileContent } from '../../components/profile/ProfileContent';

export default function ProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Auto-collapse on small screens — identical behaviour to workspace page
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

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      {/* Shared Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content area — shifts with sidebar exactly as workspace page does */}
      <div
        className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'pl-16' : 'pl-[220px]'
        }`}
      >
        <ProfileContent />
      </div>
    </div>
  );
}
