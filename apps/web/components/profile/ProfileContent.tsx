'use client';

import React, { useState, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SaveIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const CancelIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CameraIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const WorkspaceStatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ModelStatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const MaintenanceStatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);

const CalendarStatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = 'Starter' | 'Pro' | 'Enterprise';

interface ProfileData {
  fullName: string;
  email: string;
  contactNumber: string;
  plan: Plan;
  avatarInitials: string;
  avatarUrl: string | null;
  stats: {
    workspacesCreated: number;
    modelsGenerated: number;
    maintenanceAnalyses: number;
    accountCreated: string;
  };
}

interface DraftState {
  fullName: string;
  contactNumber: string;
  avatarUrl: string | null;
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: Plan }) {
  const styles: Record<Plan, string> = {
    Starter:
      'bg-[#efe9de] dark:bg-[#161618] text-[#6c6a64] dark:text-[#a09d96] border border-[#e6dfd8] dark:border-[#2a2a2b]',
    Pro: 'bg-[#cc785c]/10 text-[#cc785c] border border-[#cc785c]/25',
    Enterprise:
      'bg-[#141413]/[0.06] dark:bg-[#faf9f5]/[0.06] text-[#141413] dark:text-[#faf9f5] border border-[#141413]/15 dark:border-[#faf9f5]/15',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[plan]}`}
    >
      {plan}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col p-5 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] bg-transparent transition-all duration-300 hover:border-[#cc785c]/35 hover:-translate-y-0.5 group">
      <div className="mb-3 text-[#6c6a64] dark:text-[#a09d96] group-hover:text-[#cc785c] transition-colors duration-300">
        {icon}
      </div>
      <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight mb-1">
        {value}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]">
        {label}
      </div>
    </div>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-[#e6dfd8]/60 dark:bg-[#2a2a2b]/60" />
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  isEditing,
  readOnly = false,
  type = 'text',
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}) {
  const showInput = isEditing && !readOnly;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]">
        {label}
        {readOnly && (
          <span className="ml-2 text-[9px] normal-case tracking-normal font-medium text-[#6c6a64]/55 dark:text-[#a09d96]/55">
            read‑only
          </span>
        )}
      </label>

      {showInput ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2.5 text-sm text-[#141413] dark:text-[#faf9f5] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/25 transition-all duration-200 font-medium placeholder:text-[#6c6a64]/40 dark:placeholder:text-[#a09d96]/40"
        />
      ) : (
        <div className="text-sm font-medium text-[#141413] dark:text-[#faf9f5] py-2.5 border-b border-[#e6dfd8]/50 dark:border-[#2a2a2b]/50">
          {value || (
            <span className="text-[#6c6a64]/50 dark:text-[#a09d96]/50 italic font-normal">
              Not set
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_PROFILE: ProfileData = {
  fullName: 'Tanveer Singh',
  email: 'tanveer@airix.io',
  contactNumber: '+91 98765 43210',
  plan: 'Pro',
  avatarInitials: 'TS',
  avatarUrl: null,
  stats: {
    workspacesCreated: 12,
    modelsGenerated: 47,
    maintenanceAnalyses: 9,
    accountCreated: 'Jan 2025',
  },
};

function deriveInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function ProfileContent() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DraftState>({
    fullName: INITIAL_PROFILE.fullName,
    contactNumber: INITIAL_PROFILE.contactNumber,
    avatarUrl: INITIAL_PROFILE.avatarUrl,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Edit state machine ───────────────────────────────────────────────────

  const handleEditToggle = () => {
    setDraft({
      fullName: profile.fullName,
      contactNumber: profile.contactNumber,
      avatarUrl: profile.avatarUrl,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedName = draft.fullName.trim();
    setProfile((prev) => ({
      ...prev,
      fullName: trimmedName || prev.fullName,
      contactNumber: draft.contactNumber,
      avatarUrl: draft.avatarUrl,
      avatarInitials: trimmedName ? deriveInitials(trimmedName) : prev.avatarInitials,
    }));
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({ ...d, avatarUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // ── Derived display values ───────────────────────────────────────────────

  const displayAvatarUrl = isEditing ? draft.avatarUrl : profile.avatarUrl;
  const displayInitials = isEditing
    ? (draft.fullName.trim() ? deriveInitials(draft.fullName) : profile.avatarInitials)
    : profile.avatarInitials;
  const displayName = isEditing ? draft.fullName : profile.fullName;

  return (
    <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E]">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-6 mb-10 gap-4 border-b border-[#e6dfd8]/50 dark:border-[#2a2a2b]/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc785c] mb-2">
            Account
          </p>
          <h1 className="font-serif text-3xl md:text-[2.5rem] font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight leading-[1.1] mb-1.5">
            Your Profile
          </h1>
          <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {isEditing ? (
            <>
              <button
                id="profile-cancel-btn"
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg text-xs font-semibold text-[#6c6a64] dark:text-[#a09d96] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-all duration-200"
              >
                <CancelIcon size={13} />
                Cancel
              </button>
              <button
                id="profile-save-btn"
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#cc785c] hover:bg-[#a85b42] active:scale-[0.98] text-white font-semibold text-xs rounded-lg transition-all duration-200"
              >
                <SaveIcon size={13} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              id="profile-edit-btn"
              type="button"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141413] dark:bg-[#efe9de] hover:bg-[#252320] dark:hover:bg-[#faf9f5] active:scale-[0.98] text-[#faf9f5] dark:text-[#141413] font-semibold text-xs rounded-lg transition-all duration-200"
            >
              <EditIcon size={13} />
              Edit Profile
            </button>
          )}
        </div>
      </header>

      {/* ── Avatar + Identity ────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">

        {/* Avatar circle */}
        <div className="relative group shrink-0">
          <div className="w-[76px] h-[76px] rounded-full border-2 border-[#e6dfd8] dark:border-[#2a2a2b] bg-[#efe9de] dark:bg-[#161618] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-[#cc785c]/55">
            {displayAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatarUrl}
                alt={`${displayName} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-2xl font-normal text-[#6c6a64] dark:text-[#a09d96] select-none">
                {displayInitials}
              </span>
            )}
          </div>

          {/* Upload overlay — only clickable in edit mode */}
          {isEditing && (
            <button
              id="avatar-upload-trigger"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-[#141413]/55 backdrop-blur-[1px] flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Upload new profile image"
            >
              <CameraIcon size={16} />
              <span className="text-[8px] font-bold text-white uppercase tracking-wider mt-0.5">
                Change
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            aria-hidden="true"
          />
        </div>

        {/* Name + email + plan */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif text-2xl font-normal text-[#141413] dark:text-[#faf9f5] tracking-tight leading-tight">
              {displayName || (
                <span className="opacity-40 italic">Your Name</span>
              )}
            </h2>
            <PlanBadge plan={profile.plan} />
          </div>
          <p className="text-sm text-[#6c6a64] dark:text-[#a09d96] font-medium">
            {profile.email}
          </p>
        </div>
      </section>

      {/* ── Personal Details Fields ──────────────────────────────────────────── */}
      <SectionDivider label="Personal Details" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
        <FieldRow
          label="Full Name"
          value={isEditing ? draft.fullName : profile.fullName}
          isEditing={isEditing}
          placeholder="e.g. Tanveer Singh"
          onChange={(val) => setDraft((d) => ({ ...d, fullName: val }))}
        />

        <FieldRow
          label="Email Address"
          value={profile.email}
          isEditing={isEditing}
          readOnly
          type="email"
        />

        <FieldRow
          label="Contact Number"
          value={isEditing ? draft.contactNumber : profile.contactNumber}
          isEditing={isEditing}
          type="tel"
          placeholder="e.g. +91 98765 43210"
          onChange={(val) => setDraft((d) => ({ ...d, contactNumber: val }))}
        />

        {/* Plan — always read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#6c6a64] dark:text-[#a09d96]">
            Account Plan
            <span className="ml-2 text-[9px] normal-case tracking-normal font-medium text-[#6c6a64]/55 dark:text-[#a09d96]/55">
              read‑only
            </span>
          </label>
          <div className="flex items-center gap-3 py-2.5 border-b border-[#e6dfd8]/50 dark:border-[#2a2a2b]/50">
            <PlanBadge plan={profile.plan} />
            <span className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium">
              Manage in Subscription
            </span>
          </div>
        </div>
      </section>

      {/* ── Usage Stats ──────────────────────────────────────────────────────── */}
      <SectionDivider label="Usage Overview" />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          icon={<WorkspaceStatIcon size={20} />}
          label="Workspaces Created"
          value={profile.stats.workspacesCreated}
        />
        <StatCard
          icon={<ModelStatIcon size={20} />}
          label="3D Models Generated"
          value={profile.stats.modelsGenerated}
        />
        <StatCard
          icon={<MaintenanceStatIcon size={20} />}
          label="Maintenance Analyses"
          value={profile.stats.maintenanceAnalyses}
        />
        <StatCard
          icon={<CalendarStatIcon size={20} />}
          label="Member Since"
          value={profile.stats.accountCreated}
        />
      </section>

      {/* ── Account Actions (Danger Zone) ────────────────────────────────────── */}
      <SectionDivider label="Account Actions" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-[12px] bg-transparent">
        <div>
          <p className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5] mb-0.5">
            Delete Account
          </p>
          <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] font-medium leading-relaxed">
            Permanently remove your account and all associated workspace data. This action cannot be undone.
          </p>
        </div>
        <button
          id="profile-delete-account-btn"
          type="button"
          className="shrink-0 inline-flex items-center px-4 py-2 border border-rose-300/70 dark:border-rose-900/50 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/5 transition-all duration-200"
        >
          Delete Account
        </button>
      </div>
    </main>
  );
}
