"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Rocket, ShieldCheck, Check, BrainCircuit } from "lucide-react";

// ─── ShowcaseSection ─────────────────────────────────────────────────────────

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<SVGPathElement>(null);
  const lineRightRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const tl = gsap.timeline();

    // Cards slide up
    tl.fromTo(
      [leftCardRef.current, rightCardRef.current],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }
    );

    // Badge pops in
    tl.fromTo(
      badgeRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );

    // Lines draw in
    [lineLeftRef.current, lineRightRef.current].forEach((line) => {
      if (!line) return;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(line, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
    });

    return () => { tl.kill(); };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 lg:py-16 px-10 md:px-14 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
    >
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="mb-12 flex flex-col max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase mb-4 block font-sans">
            / The Complete Toolkit
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.05] tracking-[-1px]">
            Two Modules. One Platform.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-light-border dark:bg-dark-border rounded-2xl overflow-hidden">

          {/* ─── Design Studio ─── */}
          <div
            ref={leftCardRef}
            className="bg-light-bg dark:bg-dark-bg p-8 lg:p-10 flex flex-col opacity-0 group relative overflow-hidden"
          >
            {/* Hover grid effect — same as BenefitsSection */}
            <div
              className="absolute inset-0 bg-[#F97316]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='rgba(249, 115, 22, 0.25)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Rocket size={18} className="text-light-primary dark:text-dark-primary stroke-[1.5]" />
                  <span className="text-[18px] font-medium font-sans text-light-text dark:text-dark-text">Design Studio</span>
                </div>
                <span className="px-2.5 py-0.5 bg-light-primary text-white text-[10px] font-bold tracking-[1px] uppercase rounded-full">
                  NEW
                </span>
              </div>

              {/* Mockup Panel */}
              <div className="rounded-2xl overflow-hidden border border-light-border dark:border-dark-border mb-8">
                {/* Window Chrome */}
                <div className="h-9 border-b border-light-border dark:border-dark-border flex items-center px-4 gap-2 bg-light-surface dark:bg-dark-surface shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <span className="ml-auto text-[10px] text-light-muted dark:text-dark-muted font-sans tracking-wide">design.airix</span>
                </div>
                {/* Chart + List */}
                <div className="bg-light-surface dark:bg-dark-surface p-5 flex flex-col gap-4">
                  {/* Chart */}
                  <div className="relative w-full h-20">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" fill="none" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="300" y2="20" className="stroke-light-border dark:stroke-dark-border" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="40" x2="300" y2="40" className="stroke-light-border dark:stroke-dark-border" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="60" x2="300" y2="60" className="stroke-light-border dark:stroke-dark-border" strokeWidth="0.5" strokeDasharray="4 4" />
                      <path d="M0 65 C 60 55, 90 15, 150 30 S 240 10, 300 8" stroke="#cc785c" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="300" cy="8" r="3" fill="#cc785c" />
                      <circle cx="300" cy="8" r="7" fill="#cc785c" opacity="0.2" />
                    </svg>
                  </div>

                  {/* Component list */}
                  {["Fuselage Geometry", "Wing Assembly", "Tail Configuration"].map((item) => (
                    <div key={item} className="flex items-center justify-between bg-light-bg dark:bg-dark-bg px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border">
                      <span className="text-[12px] font-medium text-light-text dark:text-dark-text font-sans">{item}</span>
                      <Check size={14} className="text-light-primary dark:text-dark-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["Prompt-to-3D", "Live Physics", "CoG Tracker"].map((pill) => (
                  <span key={pill} className="px-3 py-1 bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary text-[10px] font-semibold tracking-[1px] uppercase rounded-full font-sans">
                    {pill}
                  </span>
                ))}
              </div>

              {/* Copy */}
              <h3 className="text-[22px] font-garamond-dark font-normal leading-[1.2] tracking-[-0.3px] text-light-text dark:text-dark-text mb-3">
                From Concept to Flyable Model in Minutes
              </h3>
              <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans">
                Describe your aircraft in natural language. Airix's generative AI reasons about aerodynamics, structural loads, and weight distribution to produce a physics-validated 3D model — ready for simulation or export.
              </p>
            </div>
          </div>

          {/* ─── Fleet Intelligence ─── */}
          <div
            ref={rightCardRef}
            className="bg-light-bg dark:bg-dark-bg p-8 lg:p-10 flex flex-col opacity-0 group relative overflow-hidden"
          >
            {/* Hover grid effect */}
            <div
              className="absolute inset-0 bg-[#F97316]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='rgba(249, 115, 22, 0.25)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-light-primary dark:text-dark-primary stroke-[1.5]" />
                  <span className="text-[18px] font-medium font-sans text-light-text dark:text-dark-text">Fleet Intelligence</span>
                </div>
                <span className="px-2.5 py-0.5 bg-light-primary text-white text-[10px] font-bold tracking-[1px] uppercase rounded-full">
                  AI
                </span>
              </div>

              {/* Mockup Panel */}
              <div className="rounded-2xl overflow-hidden border border-light-border dark:border-dark-border mb-8">
                {/* Window Chrome */}
                <div className="h-9 border-b border-light-border dark:border-dark-border flex items-center px-4 gap-2 bg-light-surface dark:bg-dark-surface shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-light-muted/30 dark:bg-dark-muted/30" />
                  <span className="ml-auto text-[10px] text-light-muted dark:text-dark-muted font-sans tracking-wide">fleet.airix</span>
                </div>
                {/* Telemetry Dashboard */}
                <div className="bg-light-surface dark:bg-dark-surface p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-5">
                    {/* Bars */}
                    <div className="flex-1 flex flex-col gap-4">
                      {[
                        { label: "ENGINE CORE", value: 92, color: "bg-light-primary" },
                        { label: "AVIONICS BUS", value: 45, color: "bg-amber-500" },
                        { label: "ACTUATORS", value: 78, color: "bg-light-muted/40 dark:bg-dark-muted/40" },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-[10px] font-medium text-light-muted dark:text-dark-muted mb-1.5 font-sans tracking-wider uppercase">
                            <span>{bar.label}</span>
                            <span>{bar.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                            <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Aircraft Silhouette */}
                    <div className="w-24 h-28 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border flex items-center justify-center p-3 relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                        <path d="M50 10 L55 30 L90 50 L90 58 L55 55 L55 78 L65 88 L65 93 L50 88 L35 93 L35 88 L45 78 L45 55 L10 58 L10 50 L45 30 Z" className="fill-light-border dark:fill-dark-border" />
                      </svg>
                      <div className="absolute top-[38%] left-[22%] w-2.5 h-2.5 bg-light-primary rounded-full shadow-[0_0_6px_rgba(204,120,92,0.6)]" />
                      <div className="absolute top-[50%] right-[28%] w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                      <div className="absolute bottom-[30%] left-[45%] w-2.5 h-2.5 bg-light-muted/40 dark:bg-dark-muted/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["RUL Prediction", "Anomaly Detection", "Auto Reports"].map((pill) => (
                  <span key={pill} className="px-3 py-1 bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary text-[10px] font-semibold tracking-[1px] uppercase rounded-full font-sans">
                    {pill}
                  </span>
                ))}
              </div>

              {/* Copy */}
              <h3 className="text-[22px] font-garamond-dark font-normal leading-[1.2] tracking-[-0.3px] text-light-text dark:text-dark-text mb-3">
                Predict Failures Before They Ground Your Fleet
              </h3>
              <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans">
                Connect live sensor telemetry from your fleet. Airix's predictive health engine calculates remaining useful life, flags anomalies in real time, and auto-generates maintenance reports — cutting unplanned downtime by 40%.
              </p>
            </div>
          </div>
        </div>

        {/* AI Engine Badge Connector */}
        <div className="flex flex-col items-center mt-0 relative">
          {/* SVG connecting lines (desktop only) */}
          <svg className="w-full h-16 overflow-visible hidden lg:block" viewBox="0 0 1000 60" fill="none" preserveAspectRatio="xMidYMid meet">
            <path ref={lineLeftRef} d="M 300 0 C 300 45, 500 25, 500 58" stroke="#cc785c" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.25" />
            <path ref={lineRightRef} d="M 700 0 C 700 45, 500 25, 500 58" stroke="#cc785c" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.25" />
          </svg>

          <div ref={badgeRef} className="flex flex-col items-center gap-2.5 opacity-0">
            <div className="w-14 h-14 rounded-full bg-light-surface dark:bg-dark-surface border-2 border-light-primary/30 dark:border-dark-primary/30 flex items-center justify-center">
              <BrainCircuit className="text-light-primary dark:text-dark-primary" size={22} />
            </div>
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-light-primary dark:text-dark-primary font-sans">
              Gemini AI Engine
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
