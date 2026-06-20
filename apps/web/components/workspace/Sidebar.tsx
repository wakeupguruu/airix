'use client';

import React from 'react';
import {
  SidebarIconDashboard,
  SidebarIconProjects,
  SidebarIconStudio,
  SidebarIconAnalytics,
  SidebarIconSettings,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from './Icons';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', icon: SidebarIconDashboard, active: true },
    { name: 'Workspaces', icon: SidebarIconProjects, active: false },
    { name: 'Concept Lab', icon: SidebarIconStudio, active: false },
    { name: 'Analytics', icon: SidebarIconAnalytics, active: false },
    { name: 'Settings', icon: SidebarIconSettings, active: false },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-airix-surface border-r border-airix-border transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header: Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-airix-border">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2">
            {/* Elegant tiny plane crosshair */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-airix-coral" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
              <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
            </svg>
            <span className="font-serif text-xl font-bold tracking-widest text-airix-text">AIRIX</span>
          </div>
        ) : (
          <div className="mx-auto">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-airix-coral mx-auto" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
              <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
            </svg>
          </div>
        )}
      </div>

      {/* Workspace Selector */}
      {!isCollapsed ? (
        <div className="p-4 border-b border-airix-border">
          <div className="flex items-center justify-between px-3 py-2 bg-airix-bg/50 rounded-lg border border-airix-border cursor-pointer hover:bg-airix-bg transition-colors duration-200">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-airix-muted font-semibold">Current Lab</span>
              <span className="text-xs font-semibold text-airix-text truncate max-w-[140px]">Supersonic Wing Lab</span>
            </div>
            <ChevronDownIcon size={14} className="text-airix-muted" />
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-airix-border flex justify-center">
          <div className="w-10 h-10 rounded-lg bg-airix-bg/50 border border-airix-border flex items-center justify-center cursor-pointer hover:bg-airix-bg transition-colors duration-200">
            <span className="text-xs font-bold text-airix-coral font-serif">S</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group text-left ${
                item.active
                  ? 'bg-airix-coral text-white shadow-sm'
                  : 'text-airix-muted hover:bg-airix-bg/70 hover:text-airix-text'
              }`}
            >
              <Icon size={20} className={`${item.active ? 'text-white' : 'text-airix-muted group-hover:text-airix-text'} transition-colors`} />
              {!isCollapsed && (
                <span className="ml-3.5 text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions & User Profile */}
      <div className="p-3 border-t border-airix-border space-y-3">
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2.5 rounded-lg border border-airix-border hover:bg-airix-bg/70 text-airix-muted hover:text-airix-text transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <div className="flex items-center space-x-2">
              <ChevronLeftIcon size={18} />
              <span className="text-xs font-medium">Collapse Sidebar</span>
            </div>
          )}
        </button>

        {/* User profile */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2 py-1.5'} space-x-3`}>
          <div className="relative w-9 h-9 rounded-full bg-airix-coral/10 border border-airix-coral/30 flex items-center justify-center text-airix-coral font-serif font-bold text-sm">
            J
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-airix-surface rounded-full"></span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-semibold text-airix-text truncate">Jonathan Archer</span>
              <span className="text-[10px] text-airix-muted truncate">Chief Aero Engineer</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
