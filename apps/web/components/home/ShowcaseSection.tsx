"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Rocket, ShieldCheck } from "lucide-react";

// ─── Tooltip Hook ────────────────────────────────────────────────────────────

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: string;
}

// ─── Design Studio Graph ─────────────────────────────────────────────────────

function LiftDragGraph() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Data points on the lift curve for hover
  const liftPoints = [
    { cx: 70, cy: 155, aoa: "2°", cl: "0.35" },
    { cx: 130, cy: 130, aoa: "6°", cl: "0.72" },
    { cx: 190, cy: 100, aoa: "10°", cl: "1.05" },
    { cx: 250, cy: 72, aoa: "13°", cl: "1.32" },
    { cx: 300, cy: 58, aoa: "15°", cl: "1.48" },
    { cx: 340, cy: 55, aoa: "16°", cl: "1.52" },
    { cx: 370, cy: 70, aoa: "18°", cl: "1.38" },
  ];

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full" viewBox="0 0 420 220" fill="none">
        {/* Fine grid — dual theme */}
        <defs>
          <pattern id="grid-design-light" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#cc785c" strokeWidth="0.5" opacity="0.2" />
          </pattern>
          <pattern id="grid-design-dark" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#cc785c" strokeWidth="0.5" opacity="0.25" />
          </pattern>
        </defs>
        <rect x="45" y="35" width="355" height="148" fill="url(#grid-design-light)" className="dark:hidden" />
        <rect x="45" y="35" width="355" height="148" fill="url(#grid-design-dark)" className="hidden dark:block" />

        {/* Y Axis with arrow */}
        <line x1="45" y1="185" x2="45" y2="38" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="0.8" />
        <polygon points="45,35 42,42 48,42" className="fill-light-muted dark:fill-dark-muted" />

        {/* X Axis with arrow */}
        <line x1="45" y1="180" x2="398" y2="180" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="0.8" />
        <polygon points="400,180 393,177 393,183" className="fill-light-muted dark:fill-dark-muted" />

        {/* Y axis labels */}
        <text x="38" y="53" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">1.6</text>
        <text x="38" y="83" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">1.2</text>
        <text x="38" y="113" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">0.8</text>
        <text x="38" y="143" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">0.4</text>
        <text x="38" y="173" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">0.0</text>

        {/* X axis labels */}
        <text x="105" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">4°</text>
        <text x="165" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">8°</text>
        <text x="225" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">12°</text>
        <text x="285" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">16°</text>
        <text x="345" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">20°</text>

        {/* Axis titles */}
        <text x="18" y="110" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="7" fontFamily="monospace" transform="rotate(-90, 18, 110)">Cl (Lift Coefficient)</text>
        <text x="220" y="210" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="7" fontFamily="monospace">Angle of Attack (α)</text>

        {/* Area fill under lift curve */}
        <path d="M70 155 C 100 145, 130 130, 190 100 S 270 62, 340 55 Q 355 53, 370 70 L 370 180 L 70 180 Z" fill="#cc785c" opacity="0.06" />

        {/* Lift curve */}
        <path d="M70 155 C 100 145, 130 130, 190 100 S 270 62, 340 55 Q 355 53, 370 70" stroke="#cc785c" strokeWidth="2.5" strokeLinecap="round" />

        {/* Drag curve — muted dashed */}
        <path d="M70 172 C 120 170, 170 162, 225 145 S 310 100, 380 60" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="1" strokeDasharray="5 4" strokeLinecap="round" opacity="0.5" />

        {/* Stall point marker */}
        <circle cx="340" cy="55" r="4" fill="#cc785c" />
        <circle cx="340" cy="55" r="10" fill="#cc785c" opacity="0.12" />

        {/* Hover hit areas — invisible large circles */}
        {liftPoints.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.cx} cy={pt.cy} r="14"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setTooltip({ x: pt.cx, y: pt.cy, label: `AoA: ${pt.aoa}`, value: `Cl: ${pt.cl}` })}
              onMouseLeave={() => setTooltip(null)}
            />
            {/* Visible dot on hover */}
            {tooltip && tooltip.x === pt.cx && (
              <>
                <circle cx={pt.cx} cy={pt.cy} r="4" fill="#cc785c" />
                {/* Vertical crosshair */}
                <line x1={pt.cx} y1={pt.cy} x2={pt.cx} y2="180" stroke="#cc785c" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              </>
            )}
          </g>
        ))}

        {/* Legend */}
        <line x1="55" y1="32" x2="73" y2="32" stroke="#cc785c" strokeWidth="2.5" />
        <text x="78" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Lift</text>
        <line x1="115" y1="32" x2="133" y2="32" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <text x="138" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Drag</text>
        <circle cx="185" cy="32" r="3" fill="#cc785c" />
        <text x="193" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Stall</text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg px-3 py-1.5 rounded-lg text-[11px] font-mono shadow-lg z-20"
          style={{
            left: `${(tooltip.x / 420) * 100}%`,
            top: `${(tooltip.y / 220) * 100 - 14}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold">{tooltip.label}</div>
          <div className="text-light-bg/70 dark:text-dark-bg/70">{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}

// ─── Fleet Intelligence Graph ────────────────────────────────────────────────

function HealthGraph() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const enginePts = [
    { cx: 70, cy: 52, month: "Jan", val: "95%" },
    { cx: 130, cy: 54, month: "Mar", val: "93%" },
    { cx: 190, cy: 57, month: "May", val: "91%" },
    { cx: 250, cy: 60, month: "Jul", val: "89%" },
    { cx: 310, cy: 62, month: "Sep", val: "87%" },
    { cx: 370, cy: 65, month: "Nov", val: "85%" },
  ];

  const avionicsPts = [
    { cx: 70, cy: 60, month: "Jan", val: "90%" },
    { cx: 130, cy: 78, month: "Mar", val: "78%" },
    { cx: 190, cy: 100, month: "May", val: "62%" },
    { cx: 250, cy: 125, month: "Jul", val: "45%" },
    { cx: 310, cy: 148, month: "Sep", val: "30%" },
    { cx: 370, cy: 162, month: "Nov", val: "18%" },
  ];

  return (
    <div className="relative w-full">
      <svg className="w-full" viewBox="0 0 420 220" fill="none">
        {/* Fine grid — dual theme */}
        <defs>
          <pattern id="grid-fleet-light" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#cc785c" strokeWidth="0.5" opacity="0.2" />
          </pattern>
          <pattern id="grid-fleet-dark" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#cc785c" strokeWidth="0.5" opacity="0.25" />
          </pattern>
        </defs>
        <rect x="45" y="35" width="355" height="148" fill="url(#grid-fleet-light)" className="dark:hidden" />
        <rect x="45" y="35" width="355" height="148" fill="url(#grid-fleet-dark)" className="hidden dark:block" />

        {/* Y Axis with arrow */}
        <line x1="45" y1="185" x2="45" y2="38" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="0.8" />
        <polygon points="45,35 42,42 48,42" className="fill-light-muted dark:fill-dark-muted" />

        {/* X Axis with arrow */}
        <line x1="45" y1="180" x2="398" y2="180" className="stroke-light-muted dark:stroke-dark-muted" strokeWidth="0.8" />
        <polygon points="400,180 393,177 393,183" className="fill-light-muted dark:fill-dark-muted" />

        {/* Y labels */}
        <text x="38" y="53" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">100</text>
        <text x="38" y="83" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">80</text>
        <text x="38" y="113" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">60</text>
        <text x="38" y="143" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">40</text>
        <text x="38" y="173" textAnchor="end" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">20</text>

        {/* X labels */}
        <text x="70" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">Jan</text>
        <text x="130" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">Mar</text>
        <text x="190" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">May</text>
        <text x="250" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">Jul</text>
        <text x="310" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">Sep</text>
        <text x="370" y="195" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="8" fontFamily="monospace">Nov</text>

        {/* Axis titles */}
        <text x="18" y="110" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="7" fontFamily="monospace" transform="rotate(-90, 18, 110)">Health Score (%)</text>
        <text x="220" y="210" textAnchor="middle" className="fill-light-muted dark:fill-dark-muted" fontSize="7" fontFamily="monospace">Timeline</text>

        {/* Critical threshold zone */}
        <rect x="45" y="145" width="350" height="35" fill="#ef4444" opacity="0.04" />
        <line x1="45" y1="145" x2="395" y2="145" stroke="#ef4444" strokeWidth="0.8" opacity="0.4" strokeDasharray="6 4" />
        <text x="398" y="148" className="fill-red-400 dark:fill-red-400" fontSize="7" fontFamily="monospace">CRITICAL</text>

        {/* Engine curve — coral, healthy */}
        <path d="M70 52 C 100 53, 130 54, 190 57 S 280 61, 370 65" stroke="#cc785c" strokeWidth="2.5" strokeLinecap="round" />

        {/* Avionics curve — amber, degrading */}
        <path d="M70 60 C 100 68, 130 78, 190 100 S 280 135, 370 162" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

        {/* Predicted zone — avionics dashed continuation */}
        <path d="M310 148 C 330 155, 350 160, 370 162" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

        {/* Warning dot — avionics crossing critical */}
        <circle cx="310" cy="148" r="4" fill="#f59e0b" />
        <circle cx="310" cy="148" r="10" fill="#f59e0b" opacity="0.12" />

        {/* Hover areas — engine */}
        {enginePts.map((pt, i) => (
          <g key={`e-${i}`}>
            <circle
              cx={pt.cx} cy={pt.cy} r="14" fill="transparent" className="cursor-pointer"
              onMouseEnter={() => setTooltip({ x: pt.cx, y: pt.cy, label: pt.month, value: `Engine: ${pt.val}` })}
              onMouseLeave={() => setTooltip(null)}
            />
            {tooltip && tooltip.x === pt.cx && tooltip.label === pt.month && (
              <>
                <circle cx={pt.cx} cy={pt.cy} r="4" fill="#cc785c" />
                <line x1={pt.cx} y1={pt.cy} x2={pt.cx} y2="180" stroke="#cc785c" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              </>
            )}
          </g>
        ))}

        {/* Hover areas — avionics */}
        {avionicsPts.map((pt, i) => (
          <g key={`a-${i}`}>
            <circle
              cx={pt.cx} cy={pt.cy} r="14" fill="transparent" className="cursor-pointer"
              onMouseEnter={() => setTooltip({ x: pt.cx, y: pt.cy, label: pt.month, value: `Avionics: ${pt.val}` })}
              onMouseLeave={() => setTooltip(null)}
            />
            {tooltip && tooltip.x === pt.cx && tooltip.value.includes("Avionics") && (
              <>
                <circle cx={pt.cx} cy={pt.cy} r="4" fill="#f59e0b" />
                <line x1={pt.cx} y1={pt.cy} x2={pt.cx} y2="180" stroke="#f59e0b" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              </>
            )}
          </g>
        ))}

        {/* Legend */}
        <line x1="55" y1="32" x2="73" y2="32" stroke="#cc785c" strokeWidth="2.5" />
        <text x="78" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Engine</text>
        <line x1="130" y1="32" x2="148" y2="32" stroke="#f59e0b" strokeWidth="2" />
        <text x="153" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Avionics</text>
        <circle cx="210" cy="32" r="3" fill="#f59e0b" />
        <text x="218" y="35" className="fill-light-text dark:fill-dark-text" fontSize="8" fontFamily="monospace">Alert</text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg px-3 py-1.5 rounded-lg text-[11px] font-mono shadow-lg z-20"
          style={{
            left: `${(tooltip.x / 420) * 100}%`,
            top: `${(tooltip.y / 220) * 100 - 14}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold">{tooltip.label}</div>
          <div className="opacity-70">{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}

// ─── ShowcaseSection ─────────────────────────────────────────────────────────

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
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
    tl.fromTo(
      [leftCardRef.current, rightCardRef.current],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }
    );
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
        <div className="flex flex-col lg:flex-row border border-light-border dark:border-dark-border rounded-2xl overflow-hidden">

          {/* ─── Design Studio ─── */}
          <div ref={leftCardRef} className="flex-1 bg-light-bg dark:bg-dark-bg p-8 lg:p-10 flex flex-col opacity-0 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-light-border dark:border-dark-border">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <Rocket size={18} className="text-light-primary dark:text-dark-primary stroke-[1.5]" />
                <span className="text-[18px] font-medium font-sans text-light-text dark:text-dark-text">Design Studio</span>
              </div>
              <h3 className="text-[22px] font-garamond-dark font-normal leading-[1.2] tracking-[-0.3px] text-light-text dark:text-dark-text mb-2">
                From Concept to Flyable Model in Minutes
              </h3>
              <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans mb-8">
                Describe your aircraft in natural language. Airix reasons about aerodynamics, structural loads, and weight to produce a physics-validated 3D model.
              </p>

              {/* Graph directly — no container */}
              <div className="flex-1 flex flex-col justify-end">
                <LiftDragGraph />
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Prompt-to-3D", "Live Physics", "CoG Tracker"].map((pill) => (
                    <span key={pill} className="px-3 py-1 bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary text-[10px] font-semibold tracking-[1px] uppercase rounded-full font-sans">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Fleet Intelligence ─── */}
          <div ref={rightCardRef} className="flex-1 bg-light-bg dark:bg-dark-bg p-8 lg:p-10 flex flex-col opacity-0 relative overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={18} className="text-light-primary dark:text-dark-primary stroke-[1.5]" />
                <span className="text-[18px] font-medium font-sans text-light-text dark:text-dark-text">Fleet Intelligence</span>
              </div>
              <h3 className="text-[22px] font-garamond-dark font-normal leading-[1.2] tracking-[-0.3px] text-light-text dark:text-dark-text mb-2">
                Predict Failures Before They Ground Your Fleet
              </h3>
              <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans mb-8">
                Connect live sensor telemetry. Airix calculates remaining useful life, flags anomalies in real time, and auto-generates maintenance reports.
              </p>

              {/* Graph directly — no container */}
              <div className="flex-1 flex flex-col justify-end">
                <HealthGraph />
                <div className="flex flex-wrap gap-2 mt-5">
                  {["RUL Prediction", "Anomaly Detection", "Auto Reports"].map((pill) => (
                    <span key={pill} className="px-3 py-1 bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary text-[10px] font-semibold tracking-[1px] uppercase rounded-full font-sans">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
