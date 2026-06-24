'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { PricingCards } from "../../components/pricing/PricingCards";
import { FeatureComparisonTable } from "../../components/pricing/FeatureComparisonTable";

export function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "text-[#cc785c]"}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "text-[#cc785c]"}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ImageFileIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "text-[#cc785c]"}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "text-[#cc785c]"}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function SubscriptionPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  // TODO: Replace with real API data once backend auth/subscription is available
  const mockPlan = { 
    planName: "Professional" as "Starter" | "Professional" | "Enterprise", // Change to "Starter" or "Professional" to test
    pricePerMonth: 499, 
    status: "Active", 
    startDate: "July 21, 2025",
    nextBillingDate: "July 21, 2026",
    daysRemaining: "29",
    usage: {
      dailyCredits: { label: "Daily Credits", used: 85, limit: 100 },
      aiImageGeneration: { label: "AI Image Generation", used: 42, limit: 100 },
    }
  };

  const isPaid = mockPlan.pricePerMonth > 0;
  const isEnterprise = mockPlan.planName === "Enterprise";

  const featuresMap: Record<string, string[]> = {
    Starter: [
      "3 Design Workspaces",
      "10 AI Image Generations / month",
      "5 Text → 3D Models / month",
      "1 Fleet Maintenance Workspace",
      "Basic Component Library (20 parts)",
      "7 days Chat History"
    ],
    Professional: [
      "Unlimited Design Workspaces",
      "100 AI Image Generations / month",
      "50 Text → 3D Models / month",
      "5 Fleet Maintenance Workspaces",
      "GenAI Diagnostic Reports included",
      "3D Risk Map included"
    ],
    Enterprise: [
      "Unlimited Design Workspaces",
      "Unlimited AI Image Generation",
      "Full + Custom Component Library",
      "Export (.glb, PDF)",
      "Unlimited Chat History",
      "Priority Support included"
    ]
  };

  const currentFeatures = featuresMap[mockPlan.planName] || [];

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0C0C0E] text-[#141413] dark:text-[#faf9f5] flex font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-16' : 'pl-[220px]'}`}>
        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col space-y-12 bg-[#faf9f5] dark:bg-[#0C0C0E]">
          
          {/* 1. PAGE HEADER ROW */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-[#141413] dark:text-[#faf9f5]">
                Subscription
              </h1>
              <p className="text-xs text-[#6c6a64] dark:text-[#a09d96] mt-1 font-medium">
                Manage your billing and plan settings.
              </p>
            </div>
            {!isEnterprise && (
              <button className="bg-[#cc785c] hover:bg-[#a85b42] text-white rounded-lg px-4 py-2 font-medium text-sm flex items-center gap-2 transition-colors">
                <DiamondIcon className="w-4 h-4 text-white" />
                Upgrade Plan
              </button>
            )}
          </div>

          {/* 2. CURRENT PLAN CARD */}
          <section>
            <div className="w-full bg-transparent rounded-[12px] border border-[#e6dfd8] dark:border-[#2a2a2b] border-t-[3px] border-t-[#cc785c] p-6 md:p-8 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg">
                    <DiamondIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">CURRENT PLAN</span>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-serif text-[#141413] dark:text-[#faf9f5] mt-1">
                        {mockPlan.planName}
                        <span className="ml-2 text-sm font-sans font-normal text-[#6c6a64] dark:text-[#a09d96]">
                          ₹{mockPlan.pricePerMonth} / month
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cc785c]/5 border border-[#cc785c]/10 text-sm font-medium text-[#cc785c]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c]"></span>
                    {mockPlan.status}
                  </span>
                  <button 
                    className={`text-sm transition-colors ${
                      isPaid 
                        ? "text-[#6c6a64] dark:text-[#a09d96] hover:text-rose-500 underline underline-offset-4" 
                        : "text-[#6c6a64]/50 dark:text-[#a09d96]/50 cursor-not-allowed pointer-events-none"
                    }`}
                    disabled={!isPaid}
                    aria-disabled={!isPaid}
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-2">DAYS REMAINING</span>
                  <span className="text-2xl font-serif text-[#cc785c]">{mockPlan.daysRemaining}</span>
                </div>
                <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-2">STARTS AT</span>
                  <span className="text-base text-[#141413] dark:text-[#faf9f5] font-medium">{mockPlan.startDate || "—"}</span>
                </div>
                <div className="bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg p-4 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96] mb-2">EXPIRES AT</span>
                  <span className="text-base text-[#141413] dark:text-[#faf9f5] font-medium">{mockPlan.nextBillingDate || "—"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. USAGE ROW */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(mockPlan.usage).map(([key, item]) => {
              const isCredits = key === "dailyCredits";
              const icon = isCredits ? <LightningIcon /> : <ImageFileIcon />;
              
              const ratio = item.limit ? item.used / item.limit : 0;
              const percent = Math.min(100, Math.max(0, ratio * 100));

              return (
                <div key={key} className="bg-transparent rounded-[12px] border border-[#e6dfd8] dark:border-[#2a2a2b] p-6 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg">
                      {icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c6a64] dark:text-[#a09d96]">{item.label}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-[#141413] dark:text-[#faf9f5] font-medium">
                        {isCredits ? "Credits Available Today" : "Usage This Cycle"}
                      </span>
                      <span className="text-base font-bold text-[#cc785c]">
                        {item.used} / {item.limit || "∞"}
                      </span>
                    </div>
                    
                    {item.limit !== null && (
                      <div className="w-full h-2 rounded-full bg-[#e6dfd8] dark:bg-[#2a2a2b] overflow-hidden mt-1">
                        <div 
                          className="h-full rounded-full bg-[#cc785c] transition-all" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 4. ENABLED FEATURES CARD */}
          <section>
            <div className="w-full bg-transparent rounded-[12px] border border-[#e6dfd8] dark:border-[#2a2a2b] p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-[#e6dfd8] dark:border-[#2a2a2b] pb-4">
                <div className="p-2.5 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg">
                  <StarIcon />
                </div>
                <h2 className="text-xl font-serif text-[#141413] dark:text-[#faf9f5]">Enabled Features</h2>
              </div>
              
              {currentFeatures.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {currentFeatures.map((feat, i) => (
                    <li key={i} className="flex gap-3 text-[#141413] dark:text-[#faf9f5] leading-[1.4]">
                      <span className="text-[#cc785c]"><CheckIcon /></span> {feat}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-[#6c6a64] dark:text-[#a09d96]">No additional features enabled on this plan.</p>
              )}
            </div>
          </section>

          {/* 5. CHANGE PLAN SECTION */}
          <section className="pt-8 border-t border-[#e6dfd8] dark:border-[#2a2a2b]">
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-normal tracking-tight text-[#141413] dark:text-[#faf9f5]">
                Change Plan
              </h2>
              <p className="text-sm text-[#6c6a64] dark:text-[#a09d96] mt-2">
                Select a plan to upgrade or downgrade your workspace.
              </p>
            </div>
            <PricingCards mode="subscription" currentPlan={mockPlan.planName} />
          </section>

          {/* 6. FEATURE COMPARISON TABLE */}
          <section>
            <FeatureComparisonTable collapsible={true} />
          </section>

        </main>
      </div>
    </div>
  );
}
