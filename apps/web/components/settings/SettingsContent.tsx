'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

// ─── Local Types ──────────────────────────────────────────────────────────────

type DefaultWorkspaceType = 'Blank Workspace' | 'Concept Studio' | 'Text → 3D';

interface GeneralSettings {
  autoSave: boolean;
  defaultWorkspaceType: DefaultWorkspaceType;
}

interface NotificationSettings {
  emailNotifications: boolean;
  analysisAlerts: boolean;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

// ─── Inline Icons ─────────────────────────────────────────────────────────────

const SunIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ChevronDownIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc785c]/40 ${
        checked
          ? 'bg-[#cc785c] border-[#cc785c]'
          : 'bg-transparent border-[#e6dfd8] dark:border-[#2a2a2b]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform duration-200 ${
          checked
            ? 'translate-x-4 bg-white'
            : 'translate-x-0.5 bg-[#6c6a64] dark:bg-[#a09d96]'
        }`}
      />
    </button>
  );
}

// ─── Theme Segment Control ────────────────────────────────────────────────────

function ThemeSegment({ mounted }: { mounted: boolean }) {
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="h-9 w-[168px] rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b] bg-transparent" />
    );
  }

  const options = [
    { value: 'light', label: 'Light', icon: <SunIcon size={14} /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon size={14} /> },
  ] as const;

  return (
    <div className="inline-flex border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg overflow-hidden bg-transparent">
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            id={`theme-${opt.value}`}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[#efe9de] dark:bg-[#161618] text-[#141413] dark:text-[#faf9f5]'
                : 'text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#efe9de]/40 dark:hover:bg-[#161618]/40'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Settings Dropdown ────────────────────────────────────────────────────────

function SettingsDropdown({
  value,
  onChange,
  options,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div id={id} className="relative w-[220px]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#141413] dark:text-[#faf9f5] bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg hover:border-[#cc785c]/40 focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 outline-none"
      >
        <span>{value}</span>
        <span className={`text-[#6c6a64] dark:text-[#a09d96] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDownIcon size={14} />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors duration-150 text-left ${
                value === opt
                  ? 'text-[#cc785c] bg-[#cc785c]/5'
                  : 'text-[#141413] dark:text-[#faf9f5] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50'
              }`}
            >
              {opt}
              {value === opt && <CheckIcon size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Password Input ───────────────────────────────────────────────────────────

function PasswordInput({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 pr-10 py-2.5 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 font-medium placeholder:text-[#6c6a64]/40 dark:placeholder:text-[#a09d96]/40 outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-3 flex items-center text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-7">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-[#e6dfd8]/60 dark:bg-[#2a2a2b]/60" />
    </div>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 py-4 border-b border-[#e6dfd8]/40 dark:border-[#2a2a2b]/40 last:border-b-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-[#141413] dark:text-[#faf9f5] leading-snug">
          {label}
        </span>
        {description && (
          <span className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-normal leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const confirmed = input === 'DELETE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#141413]/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-50 bg-[#faf9f5] dark:bg-[#0C0C0E] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] w-full max-w-md mx-4 p-6">
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-5">
          <div className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-1">
              Delete Account
            </h3>
            <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium leading-relaxed">
              This action is permanent. All workspaces, 3D models, and data will be irreversibly deleted.
            </p>
          </div>
        </div>

        {/* Confirmation input */}
        <div className="mb-5">
          <label
            htmlFor="delete-confirm-input"
            className="block text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96] mb-2"
          >
            Type <span className="font-mono text-[#141413] dark:text-[#faf9f5] tracking-normal normal-case">DELETE</span> to confirm
          </label>
          <input
            ref={inputRef}
            id="delete-confirm-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DELETE"
            autoComplete="off"
            className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2.5 text-sm font-medium text-[#141413] dark:text-[#faf9f5] focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all duration-200 placeholder:text-[#6c6a64]/40 dark:placeholder:text-[#a09d96]/40 outline-none font-mono tracking-widest"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e6dfd8]/60 dark:border-[#2a2a2b]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg text-xs font-semibold text-[#6c6a64] dark:text-[#a09d96] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-account-btn"
            type="button"
            disabled={!confirmed}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              confirmed
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                : 'bg-rose-600/30 text-white/50 cursor-not-allowed'
            }`}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main SettingsContent ─────────────────────────────────────────────────────

export function SettingsContent() {
  const [mounted, setMounted] = useState(false);

  // ── General
  const [general, setGeneral] = useState<GeneralSettings>({
    autoSave: true,
    defaultWorkspaceType: 'Concept Studio',
  });

  // ── Notifications
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    analysisAlerts: true,
  });

  // ── Password
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ── Connected accounts
  const [googleConnected, setGoogleConnected] = useState(false);

  // ── Danger Zone
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => setMounted(true), []);

  // ── Password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.current.trim()) {
      setPasswordError('Current password is required.');
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('Passwords do not match.');
      return;
    }

    // Simulate success
    setPasswordSuccess(true);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const workspaceOptions: DefaultWorkspaceType[] = ['Blank Workspace', 'Concept Studio', 'Text → 3D'];

  return (
    <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <header className="pb-6 mb-10 border-b border-[#e6dfd8]/50 dark:border-[#2a2a2b]/50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc785c] mb-2">
          Preferences
        </p>
        <h1 className="font-serif text-3xl md:text-[2.5rem] font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight leading-[1.1] mb-1.5">
          Settings
        </h1>
        <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium">
          Manage your workspace preferences, notifications, and account security.
        </p>
      </header>

      {/* ═══════════════════════════════════════════════
          01 — GENERAL
      ═══════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader label="General" />

        {/* Theme */}
        <SettingRow
          label="Appearance"
          description="Choose between light and dark interface theme."
          control={<ThemeSegment mounted={mounted} />}
        />

        {/* Auto-save */}
        <SettingRow
          label="Auto-save workspace"
          description="Automatically save your workspace progress every 30 seconds."
          control={
            <Toggle
              id="toggle-auto-save"
              checked={general.autoSave}
              onChange={(v) => setGeneral((g) => ({ ...g, autoSave: v }))}
            />
          }
        />

        {/* Default workspace type */}
        <SettingRow
          label="Default workspace type"
          description="The creation mode pre-selected when opening a new workspace."
          control={
            <SettingsDropdown
              id="dropdown-default-workspace"
              value={general.defaultWorkspaceType}
              onChange={(v) =>
                setGeneral((g) => ({ ...g, defaultWorkspaceType: v as DefaultWorkspaceType }))
              }
              options={workspaceOptions}
            />
          }
        />
      </section>

      {/* ═══════════════════════════════════════════════
          02 — NOTIFICATIONS
      ═══════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader label="Notifications" />

        <SettingRow
          label="Email notifications"
          description="Receive product updates, announcements, and usage reports."
          control={
            <Toggle
              id="toggle-email-notifications"
              checked={notifications.emailNotifications}
              onChange={(v) => setNotifications((n) => ({ ...n, emailNotifications: v }))}
            />
          }
        />

        <SettingRow
          label="Analysis complete alerts"
          description="Get notified when a maintenance analysis or model generation finishes."
          control={
            <Toggle
              id="toggle-analysis-alerts"
              checked={notifications.analysisAlerts}
              onChange={(v) => setNotifications((n) => ({ ...n, analysisAlerts: v }))}
            />
          }
        />
      </section>

      {/* ═══════════════════════════════════════════════
          03 — ACCOUNT
      ═══════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader label="Account" />

        {/* ── Change Password ─────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[#6c6a64] dark:text-[#a09d96]">
              <LockIcon size={14} />
            </span>
            <p className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">
              Change Password
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="pw-current"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]"
                >
                  Current Password
                </label>
                <PasswordInput
                  id="pw-current"
                  value={passwordForm.current}
                  placeholder="••••••••"
                  onChange={(v) => setPasswordForm((p) => ({ ...p, current: v }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="pw-new"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]"
                >
                  New Password
                </label>
                <PasswordInput
                  id="pw-new"
                  value={passwordForm.next}
                  placeholder="Min. 8 characters"
                  onChange={(v) => setPasswordForm((p) => ({ ...p, next: v }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="pw-confirm"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]"
                >
                  Confirm Password
                </label>
                <PasswordInput
                  id="pw-confirm"
                  value={passwordForm.confirm}
                  placeholder="Repeat new password"
                  onChange={(v) => setPasswordForm((p) => ({ ...p, confirm: v }))}
                />
              </div>
            </div>

            {/* Feedback */}
            {passwordError && (
              <p className="text-[11px] text-rose-500 font-medium">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckIcon size={12} />
                Password updated successfully.
              </p>
            )}

            <div>
              <button
                id="save-password-btn"
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#cc785c] hover:bg-[#a85b42] active:scale-[0.98] text-white text-xs font-semibold rounded-lg transition-all duration-200"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>

        {/* Subtle divider */}
        <div className="h-[1px] bg-[#e6dfd8]/40 dark:bg-[#2a2a2b]/40 mb-8" />

        {/* ── Connected Accounts ──────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <p className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">
              Connected Accounts
            </p>
          </div>

          {/* Google row */}
          <div className="flex items-center justify-between py-4 border-b border-[#e6dfd8]/40 dark:border-[#2a2a2b]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b] bg-transparent flex items-center justify-center">
                <GoogleIcon size={17} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#141413] dark:text-[#faf9f5]">
                  Google
                </span>
                <span className="text-[11px] text-[#6c6a64] dark:text-[#a09d96] font-medium">
                  {googleConnected
                    ? 'Connected · tanveer@gmail.com'
                    : 'Not connected'}
                </span>
              </div>
            </div>

            <button
              id="google-connect-btn"
              type="button"
              onClick={() => setGoogleConnected((c) => !c)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all duration-200 ${
                googleConnected
                  ? 'border-[#e6dfd8] dark:border-[#2a2a2b] text-[#6c6a64] dark:text-[#a09d96] hover:border-rose-300 hover:text-rose-500 dark:hover:border-rose-900/60 dark:hover:text-rose-400'
                  : 'border-[#cc785c]/40 text-[#cc785c] hover:bg-[#cc785c]/5'
              }`}
            >
              {googleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          04 — DANGER ZONE
      ═══════════════════════════════════════════════ */}
      <section>
        <SectionHeader label="Danger Zone" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] bg-transparent">
          <div>
            <p className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5] mb-0.5">
              Delete Account
            </p>
            <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium leading-relaxed max-w-sm">
              Permanently remove your account and all associated data including workspaces, models, and analyses.
            </p>
          </div>
          <button
            id="settings-delete-account-btn"
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="shrink-0 inline-flex items-center px-4 py-2 border border-rose-300/70 dark:border-rose-900/50 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/5 transition-all duration-200"
          >
            Delete Account
          </button>
        </div>
      </section>

      {/* ── Delete Confirmation Modal ─────────────────────── */}
      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
    </main>
  );
}
