"use client";

import { useRef, useEffect, useState, Fragment } from "react";
import gsap from "gsap";
import { TextCursorInput, BrainCircuit, Box, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Step Data ───────────────────────────────────────────────────────────────

interface PipelineStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: PipelineStep[] = [
  {
    number: "01",
    title: "Describe Your Aircraft",
    icon: TextCursorInput,
    description:
      "Type a natural language prompt describing your aircraft concept, specifications, and mission profile.",
  },
  {
    number: "02",
    title: "AI Generates Configuration",
    icon: BrainCircuit,
    description:
      "Our generative AI produces a mathematically accurate 3D CAD model with optimal aerodynamic properties.",
  },
  {
    number: "03",
    title: "Refine in 3D Workspace",
    icon: Box,
    description:
      "Manipulate geometry, run real-time CFD simulations, and iterate on your design in an interactive 3D editor.",
  },
  {
    number: "04",
    title: "Export & Manufacture",
    icon: Download,
    description:
      "Export production-ready STEP/STL files or send directly to certified manufacturing partners for rapid prototyping and seamless assembly.",
  },
];

// ─── Connecting Line (SVG with animated glowing dot) ─────────────────────────

function ConnectorLine({
  direction,
  animating,
}: {
  direction: "horizontal" | "vertical";
  animating: boolean;
}) {
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!animating || !dotRef.current || !glowRef.current) return;

    const isHorizontal = direction === "horizontal";

    // Animate the solid dot
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

    if (isHorizontal) {
      tl.fromTo(
        [dotRef.current, glowRef.current],
        { attr: { cx: 0 }, opacity: 0 },
        {
          attr: { cx: 100 },
          opacity: 1,
          duration: 2,
          ease: "none",
        }
      ).to([dotRef.current, glowRef.current], {
        opacity: 0,
        duration: 0.3,
      });
    } else {
      tl.fromTo(
        [dotRef.current, glowRef.current],
        { attr: { cy: 0 }, opacity: 0 },
        {
          attr: { cy: 100 },
          opacity: 1,
          duration: 2,
          ease: "none",
        }
      ).to([dotRef.current, glowRef.current], {
        opacity: 0,
        duration: 0.3,
      });
    }

    return () => {
      tl.kill();
    };
  }, [animating, direction]);

  if (direction === "horizontal") {
    return (
      <div className="hidden lg:flex items-center justify-center flex-shrink-0 w-16 xl:w-24">
        <svg
          viewBox="0 0 100 20"
          className="w-full h-5 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Dashed connector line */}
          <line
            x1="0"
            y1="10"
            x2="100"
            y2="10"
            className="stroke-light-border dark:stroke-dark-border"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Glow layer */}
          <circle
            ref={glowRef}
            cx="0"
            cy="10"
            r="6"
            fill="#cc785c"
            opacity="0"
            filter="url(#dot-glow)"
          />
          {/* Solid traveling dot */}
          <circle
            ref={dotRef}
            cx="0"
            cy="10"
            r="3"
            fill="#cc785c"
            opacity="0"
          />
          <defs>
            <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    );
  }

  // Vertical connector (mobile / tablet)
  return (
    <div className="flex lg:hidden items-center justify-center h-12 w-full">
      <svg
        viewBox="0 0 20 100"
        className="h-full w-5 overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Dashed connector line */}
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="100"
          className="stroke-light-border dark:stroke-dark-border"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Glow layer */}
        <circle
          ref={glowRef}
          cx="10"
          cy="0"
          r="6"
          fill="#cc785c"
          opacity="0"
          filter="url(#dot-glow-v)"
        />
        {/* Solid traveling dot */}
        <circle
          ref={dotRef}
          cx="10"
          cy="0"
          r="3"
          fill="#cc785c"
          opacity="0"
        />
        <defs>
          <filter id="dot-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// ─── Step Card ───────────────────────────────────────────────────────────────

function StepCard({
  step,
  animating,
  index,
}: {
  step: PipelineStep;
  animating: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = step.icon;

  useEffect(() => {
    if (!animating || !cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.2,
        ease: "power3.out",
      }
    );
  }, [animating, index]);

  return (
    <div
      ref={cardRef}
      className="relative bg-transparent rounded-2xl border border-light-border dark:border-dark-border p-6 lg:p-8 flex flex-col items-start flex-1 min-w-0 h-full min-h-[300px] lg:min-h-[320px] opacity-0"
    >
      {/* Number badge */}
      <div className="mb-5">
        <span className="text-2xl font-garamond-dark font-semibold text-[#cc785c]">
          {step.number}
        </span>
      </div>

      {/* Icon */}
      <Icon
        size={22}
        className="text-light-text dark:text-dark-text mb-4 stroke-[1.5]"
      />

      {/* Title */}
      <h3 className="text-[17px] font-semibold font-sans mb-2 text-light-text dark:text-dark-text">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans">
        {step.description}
      </p>
    </div>
  );
}

// ─── Pipeline Section ────────────────────────────────────────────────────────

export function PipelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer — trigger animations when section scrolls into view
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

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 lg:py-16 px-10 md:px-14 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
    >
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="mb-14 flex flex-col max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase mb-4 block font-sans">
            / The Design Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.05] tracking-[-1px]">
            From Prompt to Prototype in Four Steps
          </h2>
        </div>

        {/* Pipeline: Grid on desktop, stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-12 lg:gap-x-16 xl:gap-x-24">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-stretch">
              {/* Step Card */}
              <StepCard step={step} animating={isVisible} index={i} />

              {/* Absolutely positioned connectors in the grid gap */}
              {i < STEPS.length - 1 && (
                <>
                  {/* Desktop: horizontal connector */}
                  <div className="hidden lg:block absolute top-1/2 -right-16 xl:-right-24 -translate-y-1/2 z-0">
                    <ConnectorLine direction="horizontal" animating={isVisible} />
                  </div>
                  {/* Mobile: vertical connector */}
                  <div className="lg:hidden absolute -bottom-12 left-1/2 -translate-x-1/2 z-0 w-full">
                    <ConnectorLine direction="vertical" animating={isVisible} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
