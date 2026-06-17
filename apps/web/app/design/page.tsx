"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DesignSystem() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full min-h-screen p-8 md:p-16 transition-colors duration-300 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col items-center font-sans">
      
      {/* Header & Theme Toggle */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl font-serif">Airix Design System</h1>
          <p className="text-light-muted dark:text-dark-muted mt-1">Component reference and styling guidelines</p>
          <Link href="/" className="text-light-primary dark:text-dark-primary text-sm hover:underline mt-2 inline-block">&larr; Back to Home</Link>
        </div>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border"
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        )}
      </div>

      <div className="w-full max-w-5xl space-y-24">
        
        {/* 01 — AEROSPACE MODULES & CALLOUTS */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            01 &mdash; AEROSPACE MODULES & CALLOUTS
          </div>
          
          <h2 className="text-4xl md:text-5xl tracking-tight font-serif mb-10 text-light-text dark:text-dark-text">
            Intelligent modules + coral callouts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-light-surface dark:bg-dark-surface transition-colors flex flex-col gap-4">
              <div className="w-11 h-11 rounded-lg bg-white dark:bg-[#0c0c0e] border border-light-border dark:border-dark-border flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="10" height="10" rx="2" fill="#5db8a6" />
                  <rect x="11" y="11" width="10" height="10" rx="2" fill="#cc785c" />
                  <rect x="8" y="8" width="10" height="10" rx="2" fill="#3b82f6" />
                </svg>
              </div>
              <h3 className="text-[22px] font-serif text-light-text dark:text-dark-text mt-3">
                Prompt-to-Prototype
              </h3>
              <p className="text-light-muted dark:text-dark-muted text-[15px] leading-relaxed">
                Describe your aircraft in plain language, and Airix reasons about physics to generate a structured 3D model in seconds.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-light-surface dark:bg-dark-surface transition-colors flex flex-col gap-4">
              <div className="w-11 h-11 rounded-lg bg-white dark:bg-[#0c0c0e] border border-light-border dark:border-dark-border flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.5C12 21.5 5 17 5 10V6L12 3.5L19 6V10C19 17 12 21.5 12 21.5Z" fill="#3b82f6" />
                  <path d="M12 21.5C12 21.5 5 17 5 10V6L12 3.5L19 6V10C19 17 12 21.5 12 21.5Z" fill="white" fillOpacity="0.2" />
                </svg>
              </div>
              <h3 className="text-[22px] font-serif text-light-text dark:text-dark-text mt-3">
                Live Physics Dashboard
              </h3>
              <p className="text-light-muted dark:text-dark-muted text-[15px] leading-relaxed">
                Instant recalculation of weight distribution, drag coefficient, and structural stress on every component swap.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent transition-colors flex flex-col gap-4 mt-2">
              <h3 className="text-3xl font-serif text-light-text dark:text-dark-text mt-1">
                Predictive Maintenance
              </h3>
              <p className="text-light-muted dark:text-dark-muted text-[15px] leading-relaxed flex-grow">
                Live health models for your fleet, predicting component failures before they happen using sensor telemetry.
              </p>
              <a href="#" className="text-light-primary dark:text-dark-primary text-[15px] font-medium mt-3 hover:underline transition-all w-fit">
                View predictive engine &rarr;
              </a>
            </div>

            <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent transition-colors flex flex-col gap-4 mt-2">
              <h3 className="text-3xl font-serif text-light-text dark:text-dark-text mt-1">
                Configuration Export
              </h3>
              <p className="text-light-muted dark:text-dark-muted text-[15px] leading-relaxed flex-grow">
                Export full component specifications, structural reports, and cost breakdowns directly to procurement.
              </p>
              <a href="#" className="text-light-primary dark:text-dark-primary text-[15px] font-medium mt-3 hover:underline transition-all w-fit">
                View export tools &rarr;
              </a>
            </div>
          </div>

          <div className="w-full p-12 md:p-16 rounded-2xl bg-light-primary dark:bg-dark-primary flex flex-col items-start gap-6 mt-12">
            <h2 className="text-4xl md:text-[44px] tracking-tight font-serif text-white leading-[1.1]">
              Start building with Airix
            </h2>
            <p className="text-[17px] text-white/95 leading-relaxed max-w-2xl font-sans">
              Design intelligent aircraft and keep your fleet flying safely. The modern toolchain for aerospace engineers.
            </p>
            <button className="mt-4 px-5 py-[10px] bg-light-bg text-light-text rounded-md font-medium hover:opacity-90 transition-opacity">
              Enter the Workspace
            </button>
          </div>
        </section>

        {/* 02 — TYPOGRAPHY */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            02 &mdash; TYPOGRAPHY
          </div>
          
          <div className="mb-16">
            <h2 className="text-[40px] font-serif mb-4">EB Garamond serif + Inter sans</h2>
            <p className="text-[16px] text-light-muted dark:text-dark-muted max-w-3xl leading-[1.55]">
              Slab-serif display for headlines (EB Garamond), humanist sans for body (Inter). The serif character is the editorial brand voice — switching to sans display would flatten Airix into another SaaS tool.
            </p>
          </div>
          
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">display-xl</p>
                  <p>64px / 400 / 1.05 / -1.5px</p>
                  <p>EB Garamond serif</p>
                </div>
                <div className="col-span-3 text-[64px] font-serif font-normal leading-[1.05] tracking-[-1.5px]">
                  Design your aircraft intelligently
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">display-lg</p>
                  <p>48px / 400 / 1.1 / -1px</p>
                </div>
                <div className="col-span-3 text-[48px] font-serif font-normal leading-[1.1] tracking-[-1px]">
                  For the curious, the careful, the brilliant
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">display-md</p>
                  <p>36px / 400 / 1.15 / -0.5px</p>
                </div>
                <div className="col-span-3 text-[36px] font-serif font-normal leading-[1.15] tracking-[-0.5px]">
                  Build with Airix
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">display-sm</p>
                  <p>28px / 400 / 1.2 / -0.3px</p>
                </div>
                <div className="col-span-3 text-[28px] font-serif font-normal leading-[1.2] tracking-[-0.3px]">
                  Pricing for every team
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">title-lg</p>
                  <p>22px / 500 / 1.3</p>
                  <p>Inter sans</p>
                </div>
                <div className="col-span-3 text-[22px] font-medium leading-[1.3] font-sans">
                  Pro &middot; $20 / month
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">title-md</p>
                  <p>18px / 500 / 1.4</p>
                </div>
                <div className="col-span-3 text-[18px] font-medium leading-[1.4] font-sans">
                  Physics-aware component models
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">title-sm</p>
                  <p>16px / 500 / 1.4</p>
                </div>
                <div className="col-span-3 text-[16px] font-medium leading-[1.4] font-sans">
                  Export CAD specification
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">body-md</p>
                  <p>16px / 400 / 1.55</p>
                </div>
                <div className="col-span-3 text-[16px] font-normal leading-[1.55] font-sans max-w-3xl">
                  Airix instantly validates every design decision against real physics, cost, and structural constraints—so you can see the consequences in seconds, not days.
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">body-sm</p>
                  <p>14px / 400 / 1.55</p>
                </div>
                <div className="col-span-3 text-[14px] font-normal leading-[1.55] font-sans">
                  Footer body, fine-print legal text &mdash; same Inter face at smaller size.
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">caption</p>
                  <p>13px / 500 / 1.4</p>
                </div>
                <div className="col-span-3 text-[13px] font-medium leading-[1.4] font-sans">
                  Limited beta &middot; Available in App
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">caption-uppercase</p>
                  <p>12px / 500 / 1.5px</p>
                </div>
                <div className="col-span-3 text-[12px] font-medium tracking-[1.5px] uppercase font-sans">
                  NEW &middot; PREDICTIVE HEALTH
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-light-border dark:border-dark-border pb-8">
                <div className="col-span-1 text-[13px] text-light-muted dark:text-dark-muted font-sans leading-relaxed">
                  <p className="font-semibold text-light-text dark:text-dark-text mb-1">code</p>
                  <p>14px / 400 / 1.6</p>
                </div>
                <div className="col-span-3 text-[14px] font-normal leading-[1.6] font-mono">
                  <code>airix.fleet.predict(&#123; aircraft: "uav-alpha" &#125;)</code>
                </div>
             </div>
          </div>
        </section>

        {/* 03 — BUTTON VARIANTS */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            03 &mdash; BUTTON VARIANTS
          </div>
          
          <div className="mb-12">
            <h2 className="text-[40px] font-serif mb-4">Coral primary, cream secondary</h2>
            <p className="text-[16px] text-light-muted dark:text-dark-muted max-w-3xl leading-[1.55]">
              Coral CTAs only. Secondary buttons are cream-canvas with hairline outline. Dark surfaces get a slightly elevated dark button.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {/* 1. button-primary */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-primary</p>
                <button className="bg-light-primary dark:bg-dark-primary text-white px-5 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity">
                  Open Studio
                </button>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">primary coral / on-primary white / md radius</p>
             </div>
             
             {/* 2. button-primary-active */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-primary-active</p>
                <button className="bg-light-primary-active dark:bg-dark-primary-active text-white px-5 py-2.5 rounded-md font-medium">
                  Pressed
                </button>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">primary-active darker coral</p>
             </div>
             
             {/* 3. button-primary-disabled */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-primary-disabled</p>
                <button className="bg-light-primary-disabled dark:bg-dark-primary-disabled text-light-muted dark:text-dark-muted px-5 py-2.5 rounded-md font-medium cursor-not-allowed">
                  Disabled
                </button>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">cream-tinted disabled fill</p>
             </div>
             
             {/* 4. button-secondary */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-secondary</p>
                <button className="bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text px-5 py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                  View specs
                </button>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">cream / ink / hairline outline</p>
             </div>
             
             {/* 5. button-secondary-on-dark */}
             <div className="p-6 rounded-xl border border-dark-border flex flex-col items-start gap-4 bg-dark-surface text-white">
                <p className="text-[14px] font-semibold text-white">button-secondary-on-dark</p>
                <button className="bg-button-dark-bg border border-dark-border text-white px-5 py-2.5 rounded-md font-medium hover:bg-button-dark-hover transition-colors">
                  View diagnostic
                </button>
                <p className="text-[13px] text-dark-muted mt-2">surface-dark-elevated / on-dark</p>
             </div>
             
             {/* 6. button-text-link */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-text-link</p>
                <button className="text-light-text dark:text-dark-text font-medium hover:opacity-70 transition-opacity">
                  Engineer Login
                </button>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">No background; inline link-style</p>
             </div>

             {/* 7. text-link-coral */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">text-link-coral</p>
                <a href="#" className="text-light-primary dark:text-dark-primary font-medium hover:underline transition-all inline-flex items-center gap-1">
                  Read the research &rarr;
                </a>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">Inline coral link in body. The signature small detail.</p>
             </div>

             {/* 8. button-icon-circular */}
             <div className="p-6 rounded-xl border border-light-border dark:border-dark-border flex flex-col items-start gap-4 bg-light-bg dark:bg-dark-bg">
                <p className="text-[14px] font-semibold text-light-text dark:text-dark-text">button-icon-circular</p>
                <div className="flex gap-3">
                  <button className="w-9 h-9 rounded-full bg-transparent border border-light-secondary-border dark:border-dark-secondary-border flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button className="w-9 h-9 rounded-full bg-transparent border border-light-secondary-border dark:border-dark-secondary-border flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <p className="text-[13px] text-light-muted dark:text-dark-muted mt-2">36 &times; 36 / canvas / hairline / full radius</p>
             </div>
          </div>
        </section>

        {/* 04 — CONNECTOR TILE GRID */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            04 &mdash; CONNECTOR TILE GRID
          </div>
          <h3 className="text-4xl font-serif tracking-tight mb-6">Connect your engineering stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
             {[
               {initial: 'C', title: 'CAD Systems', desc: 'Import solid models and structural constraints.'},
               {initial: 'T', title: 'Telemetry Stream', desc: 'Connect live sensor data for predictive health.'},
               {initial: 'M', title: 'Maintenance Logs', desc: 'Sync historical service records and lifecycles.'},
               {initial: 'E', title: 'Procurement ERP', desc: 'Push finalized bills of materials directly to SAP.'},
             ].map((tile, i) => (
                <div key={i} className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-md bg-light-surface dark:bg-dark-surface flex items-center justify-center font-medium text-light-text dark:text-dark-text border border-light-border dark:border-dark-border">
                    {tile.initial}
                  </div>
                  <h4 className="font-semibold text-[15px]">{tile.title}</h4>
                  <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
             ))}
          </div>
        </section>

        {/* 05 — PRICING TIERS */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            05 &mdash; PRICING TIERS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-6">
                <div>
                   <h3 className="text-2xl font-serif">Basic</h3>
                   <div className="text-[40px] font-serif mt-2">$0</div>
                </div>
                <ul className="space-y-3 text-sm flex-grow">
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Basic 3D workspace</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Standard components</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Manual physics checks</li>
                </ul>
                <button className="w-full bg-transparent border border-light-border dark:border-dark-border text-light-text dark:text-dark-text py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                  Get started
                </button>
             </div>
             <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-6">
                <div>
                   <h3 className="text-2xl font-serif">Pro</h3>
                   <div className="text-[40px] font-serif mt-2">$20</div>
                </div>
                <ul className="space-y-3 text-sm flex-grow">
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Prompt-to-prototype engine</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Live physics dashboard</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Configuration export</li>
                </ul>
                <button className="w-full bg-light-primary text-white py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity">
                  Upgrade to Pro
                </button>
             </div>
             <div className="p-8 rounded-2xl border border-[#2a2a2b] bg-[#161618] text-white flex flex-col gap-6 transform md:scale-105 shadow-xl relative z-10">
                <div>
                   <h3 className="text-2xl font-serif">Fleet</h3>
                   <div className="text-[40px] font-serif mt-2">$300 <span className="text-xl font-sans text-[#a09d96]">/ aircraft</span></div>
                </div>
                <ul className="space-y-3 text-sm flex-grow text-[#e6dfd8]">
                   <li className="flex gap-2"><span className="text-green-500">✓</span> Predictive health engine</li>
                   <li className="flex gap-2"><span className="text-green-500">✓</span> Fleet telemetry sync</li>
                   <li className="flex gap-2"><span className="text-green-500">✓</span> Automated diagnostics</li>
                </ul>
                <button className="w-full bg-light-primary text-white py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity">
                  Contact sales
                </button>
             </div>
             <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-6">
                <div>
                   <h3 className="text-2xl font-serif">Enterprise</h3>
                   <div className="text-[40px] font-serif mt-2">Custom</div>
                </div>
                <ul className="space-y-3 text-sm flex-grow">
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> Custom aerospace models</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> On-prem deployment</li>
                   <li className="flex gap-2"><span className="text-green-600 dark:text-green-500">✓</span> ERP integration</li>
                </ul>
                <button className="w-full bg-transparent border border-light-border dark:border-dark-border text-light-text dark:text-dark-text py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                  Contact sales
                </button>
             </div>
          </div>
        </section>

        {/* 06 — FORM ELEMENTS */}
        <section className="space-y-8">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            06 &mdash; FORM ELEMENTS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
                <label className="text-[15px] font-medium">Engineer email</label>
                <input 
                  type="email" 
                  placeholder="name@aeroforge.com" 
                  className="w-full px-3.5 py-2 rounded-md border border-light-border dark:border-dark-border bg-transparent placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none"
                  readOnly
                />
             </div>
             <div className="space-y-2">
                <label className="text-[15px] font-medium">Email (focused)</label>
                <input 
                  type="email" 
                  value="engineer@fleet.com" 
                  className="w-full px-3.5 py-2 rounded-md border border-light-primary outline outline-[3px] outline-light-primary/20 bg-transparent focus:outline-none"
                  readOnly
                />
             </div>
             <div className="space-y-2">
                <label className="text-[15px] font-medium">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. UAV-Alpha" 
                  className="w-full px-3.5 py-2 rounded-md border border-light-border dark:border-dark-border bg-transparent placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none"
                  readOnly
                />
             </div>
             <div className="col-span-1 md:col-span-3 space-y-2 max-w-md">
                <label className="text-[15px] font-medium">Aircraft Requirements</label>
                <textarea 
                  placeholder="Describe your aircraft..." 
                  className="w-full px-3.5 py-2 rounded-md border border-light-border dark:border-dark-border bg-transparent placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none min-h-[100px]"
                  readOnly
                />
             </div>
          </div>
        </section>

        {/* 07 — BADGES */}
        <section className="space-y-8 pb-24">
          <div className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase border-b border-light-border dark:border-dark-border pb-2 mb-8">
            07 &mdash; BADGES
          </div>
          <div className="flex gap-4 items-center">
            <span className="px-3 py-1 rounded-full bg-light-surface dark:bg-dark-surface text-sm font-medium border border-light-border dark:border-dark-border">
              badge-pill
            </span>
            <span className="px-3 py-1 rounded-full bg-light-primary text-white text-[12px] font-semibold tracking-wider uppercase">
              badge-coral
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}
