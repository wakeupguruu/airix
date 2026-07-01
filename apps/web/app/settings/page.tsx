'use client';

import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Save, 
  ShieldAlert, 
  KeyRound, 
  Grid 
} from 'lucide-react';

export default function SettingsPage() {
  // --- STATE PARAMETERS MAP ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [defaultWorkspace, setDefaultWorkspace] = useState('Concept Studio');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- ACTIONS ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configuration updated securely.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-12 text-light-text dark:text-dark-text animate-fade-in">
      
      {/* Structural Header */}
      <div className="space-y-1">
        <h1 className="font-garamond-dark text-3xl font-medium tracking-tight">
          System Settings
        </h1>
        <p className="text-[11px] uppercase tracking-widest text-light-muted dark:text-dark-muted">
          Configure workspace environment & account parameters
        </p>
      </div>

      <hr className="border-light-border dark:border-dark-border" />

      {/* 1. General Configuration Block */}
      <section className="space-y-6">
        <h2 className="text-[11px] uppercase tracking-widest text-light-muted dark:text-dark-muted font-semibold">
          General Configurations
        </h2>
        
        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-sans text-sm font-medium">Application Interface Theme</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">Toggle global surface color matrix rules</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
              <button 
                type="button"
                onClick={() => setTheme('light')}
                className={`p-2 rounded-sm transition-all ${theme === 'light' ? 'bg-light-surface dark:bg-dark-surface shadow-sm' : 'opacity-50'}`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button 
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-sm transition-all ${theme === 'dark' ? 'bg-light-surface dark:bg-dark-surface shadow-sm' : 'opacity-50'}`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Auto-Save Workspace */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-sans text-sm font-medium">Auto-save Workspace Canvas</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">Instantly back up Three.js 3D viewport state layers</p>
            </div>
            <button 
              type="button"
              onClick={() => setAutoSave(!autoSave)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${autoSave ? 'bg-[#cc785c]' : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${autoSave ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Default Workspace Dropdown */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-sans text-sm font-medium">Default Matrix Creation Mode</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">Initial configuration rule for core creation routing</p>
            </div>
            <select 
              value={defaultWorkspace}
              onChange={(e) => setDefaultWorkspace(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface font-sans text-sm focus:outline-none focus:border-[#cc785c] transition-colors"
            >
              <option value="Concept Studio">Concept Studio</option>
              <option value="Blank Workspace">Blank Workspace</option>
              <option value="Text→3D">Text → 3D</option>
            </select>
          </div>
        </div>
      </section>

      <hr className="border-light-border dark:border-dark-border" />

      {/* 2. Notifications Section */}
      <section className="space-y-6">
        <h2 className="text-[11px] uppercase tracking-widest text-light-muted dark:text-dark-muted font-semibold">
          Notification Rules
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-sans text-sm font-medium">Global Email Communications</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">Receive systematic diagnostic logs and summary reporting</p>
            </div>
            <button 
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${emailNotifications ? 'bg-[#cc785c]' : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-sans text-sm font-medium">Analysis Complete Alerts</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">Instant alert routing upon completion of Fleet Maintenance checks</p>
            </div>
            <button 
              type="button"
              onClick={() => setAnalysisAlerts(!analysisAlerts)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${analysisAlerts ? 'bg-[#cc785c]' : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${analysisAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <hr className="border-light-border dark:border-dark-border" />

      {/* 3. Account Section & Security Panels */}
      <section className="space-y-6">
        <h2 className="text-[11px] uppercase tracking-widest text-light-muted dark:text-dark-muted font-semibold">
          Account Security & Integrations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
          {/* Password Updates */}
          <form onSubmit={savePassword} className="space-y-4">
            <p className="font-sans text-sm font-medium flex items-center gap-2 text-light-muted dark:text-dark-muted">
              <KeyRound className="h-4 w-4" /> Update Access Cryptography
            </p>
            <div className="space-y-3">
              <input 
                type="password"
                name="current"
                placeholder="Current Password"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-transparent focus:outline-none focus:border-[#cc785c] transition-colors font-sans"
                required
              />
              <input 
                type="password"
                name="new"
                placeholder="New Password"
                value={passwordForm.new}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-transparent focus:outline-none focus:border-[#cc785c] transition-colors font-sans"
                required
              />
              <input 
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-transparent focus:outline-none focus:border-[#cc785c] transition-colors font-sans"
                required
              />
            </div>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-4 py-1.5 bg-[#cc785c] text-white text-[11px] uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity font-sans font-medium"
            >
              <Save className="h-3.5 w-3.5" /> Save Verification
            </button>
          </form>

          {/* Connected Provider Rails */}
          <div className="space-y-4">
            <p className="font-sans text-sm font-medium flex items-center gap-2 text-light-muted dark:text-dark-muted">
              <Grid className="h-4 w-4" /> Identity Sync Providers
            </p>
            <div className="p-4 rounded-md border border-light-border dark:border-dark-border flex items-center justify-between bg-light-surface dark:bg-dark-surface">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.427-3.3c-2.2-2.05-5.037-3.3-8.474-3.3C5.124 1.33 0 6.454 0 12.83s5.124 11.5 11.44 11.5c6.59 0 10.974-4.63 10.974-11.17 0-.75-.08-1.32-.177-1.875H12.24z"/>
                </svg>
                <div>
                  <p className="font-sans text-sm font-medium">Google Infrastructure</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted">
                    {isGoogleConnected ? 'Active Identity Link established' : 'Identity mapping disconnected'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsGoogleConnected(!isGoogleConnected)}
                className={`px-3 py-1 text-xs font-medium tracking-wide rounded border transition-colors ${
                  isGoogleConnected 
                    ? 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:bg-red-500/10 hover:text-red-500 hover:border-red-500' 
                    : 'border-[#cc785c] text-[#cc785c] hover:bg-[#cc785c]/10'
                }`}
              >
                {isGoogleConnected ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-light-border dark:border-dark-border" />

      {/* 4. Danger Zone Operational Block */}
      <section className="p-6 border border-red-500/20 dark:border-red-500/30 rounded-md bg-transparent space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-sans text-sm font-semibold text-red-500 uppercase tracking-wider">
              Irreversible Operations Zone
            </h3>
            <p className="text-xs text-light-muted dark:text-dark-muted max-w-xl">
              Executing processes inside this space will purge all related infrastructure, workspaces, asset keys, and historical calculations permanently.
            </p>
          </div>
        </div>

        <div>
          <button 
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-transparent border border-red-500 text-red-500 text-xs font-semibold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all font-sans"
          >
            Purge Account Node
          </button>
        </div>
      </section>

      {/* Strict Confirmation Prompt Overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md p-6 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md space-y-4">
            <div className="space-y-2">
              <h4 className="font-garamond-dark text-xl text-red-500">Confirm Global Account Erasure</h4>
              <p className="text-xs text-light-muted dark:text-dark-muted">
                To confirm permanent operational node deletion, type <span className="font-mono font-bold text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface px-1 py-0.5 rounded">DELETE</span> down below.
              </p>
            </div>
            
            <input 
              type="text"
              placeholder="Type DELETE to execute"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-transparent font-mono focus:outline-none focus:border-red-500 transition-colors"
            />

            <div className="flex items-center justify-end gap-3 text-[11px] uppercase tracking-widest font-medium">
              <button 
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
              >
                Abort
              </button>
              <button 
                type="button"
                disabled={deleteConfirmation !== 'DELETE'}
                onClick={() => console.log('Account node executed successfully.')}
                className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
              >
                Execute Purge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}