"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Counter Hook ────────────────────────────────────────────────────────────

function useCountUp(endValue: number, prefix: string, suffix: string, isVisible: boolean) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (!isVisible) return;

    objRef.current.val = 0;
    setDisplay(`${prefix}0${suffix}`);

    const tween = gsap.to(objRef.current, {
      val: endValue,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(`${prefix}${Math.floor(objRef.current.val)}${suffix}`);
      },
    });

    return () => { tween.kill(); };
  }, [endValue, prefix, suffix, isVisible]);

  return display;
}

// ─── Metric Data ─────────────────────────────────────────────────────────────

const METRICS = [
  { end: 10, prefix: "", suffix: "x", label: "Faster Design Cycle" },
  { end: 99, prefix: "", suffix: "%", label: "Physics Fidelity" },
  { end: 2, prefix: "<", suffix: "s", label: "Recalculation" },
  { end: 40, prefix: "", suffix: "%", label: "Cost Reduction" },
];

// ─── ImpactSection ───────────────────────────────────────────────────────────

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
    if (!isVisible || !ctaRef.current) return;

    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [isVisible]);

  const m0 = useCountUp(METRICS[0].end, METRICS[0].prefix, METRICS[0].suffix, isVisible);
  const m1 = useCountUp(METRICS[1].end, METRICS[1].prefix, METRICS[1].suffix, isVisible);
  const m2 = useCountUp(METRICS[2].end, METRICS[2].prefix, METRICS[2].suffix, isVisible);
  const m3 = useCountUp(METRICS[3].end, METRICS[3].prefix, METRICS[3].suffix, isVisible);
  const metricValues = [m0, m1, m2, m3];

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 lg:py-16 px-10 md:px-14 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
    >
      <div className="w-[90%] mx-auto">
        {/* Coral CTA Container */}
        <div
          ref={ctaRef}
          className="w-full rounded-2xl bg-light-primary dark:bg-dark-primary p-10 md:p-14 lg:p-16 flex flex-col opacity-0"
        >
          {/* Top: Headline + Description */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold tracking-[0.15em] text-white/60 uppercase mb-4 block font-sans">
                / Why Airix
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[44px] font-garamond-dark font-normal leading-[1.1] tracking-[-0.5px] text-white">
                Built for India&apos;s Aerospace Future
              </h2>
            </div>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-md font-sans">
              India&apos;s aerospace sector is accelerating — from DRDO&apos;s UAV programs to indigenous fighter jets. Airix is the modern toolchain built to power this wave.
            </p>
          </div>

          {/* Middle: Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-t border-white/15 pt-10">
            {METRICS.map((metric, i) => (
              <div key={metric.label} className="flex flex-col">
                <div className="text-[36px] md:text-[42px] font-garamond-dark text-white leading-none mb-2">
                  {metricValues[i]}
                </div>
                <span className="text-[12px] font-sans text-white/60 font-medium tracking-wide">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom: CTA Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/workspace">
              <button className="bg-white text-light-text px-6 py-3 rounded-md font-medium font-sans text-[15px] hover:opacity-90 transition-opacity flex items-center gap-2.5 cursor-pointer">
                Start Designing Now
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </Link>
            <span className="text-[13px] text-white/50 font-sans">
              Free to start &middot; No credit card required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
