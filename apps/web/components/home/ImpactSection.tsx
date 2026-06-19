"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function useCountUp(endValue: number, suffix: string = "", isVisible: boolean) {
  const [value, setValue] = useState(0);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (!isVisible) return;
    
    // Reset to 0 before animating
    objRef.current.val = 0;
    setValue(0);

    const tl = gsap.to(objRef.current, {
      val: endValue,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setValue(Math.floor(objRef.current.val));
      },
    });

    return () => {
      tl.kill();
    };
  }, [endValue, isVisible]);

  return `${value}${suffix}`;
}

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
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
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 lg:py-32 px-10 md:px-14 bg-light-bg text-[#1A1A1A] font-sans flex flex-col items-center text-center"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <span className="text-[11px] font-bold tracking-[0.15em] text-[#C4704D] uppercase mb-6 font-sans">
          / Why Airix
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.1] tracking-[-1px] text-[#1A1A1A] max-w-3xl mb-20">
          Built for <span className="text-[#C4704D]">India's</span> Aerospace Future
        </h2>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-24">
          <div className="flex flex-col items-center">
            <div className="text-5xl lg:text-6xl font-garamond-dark text-[#C4704D] mb-4">
              {useCountUp(10, "x", isVisible)}
            </div>
            <div className="w-full h-px bg-light-border max-w-[120px] mb-4" />
            <span className="text-sm font-sans text-light-muted font-medium">Faster Design Cycle</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-5xl lg:text-6xl font-garamond-dark text-[#C4704D] mb-4">
              {useCountUp(99, "%", isVisible)}
            </div>
            <div className="w-full h-px bg-light-border max-w-[120px] mb-4" />
            <span className="text-sm font-sans text-light-muted font-medium">Physics Fidelity Match</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-5xl lg:text-6xl font-garamond-dark text-[#C4704D] mb-4">
              {useCountUp(2, "s", isVisible)}
            </div>
            <div className="w-full h-px bg-light-border max-w-[120px] mb-4" />
            <span className="text-sm font-sans text-light-muted font-medium">Real-Time Recalculation</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-5xl lg:text-6xl font-garamond-dark text-[#C4704D] mb-4">
              {useCountUp(40, "%", isVisible)}
            </div>
            <div className="w-full h-px bg-light-border max-w-[120px] mb-4" />
            <span className="text-sm font-sans text-light-muted font-medium">Maintenance Cost Cut</span>
          </div>
        </div>

        {/* Quote */}
        <p className="text-lg md:text-xl font-garamond-dark italic text-light-muted max-w-4xl leading-relaxed mb-16">
          "India's aerospace sector is accelerating — from DRDO's UAV programs to indigenous fighter jets and the Make in India initiative. Airix is built to power this wave."
        </p>

        {/* CTA Button */}
        <Link href="/workspace" className="mb-24">
          <button className="bg-[#C4704D] hover:bg-[#b06342] text-white px-8 py-4 rounded-full font-medium font-sans text-[15px] transition-colors duration-200 flex items-center gap-2 shadow-sm">
            Start Designing Now
            <ArrowRight size={18} />
          </button>
        </Link>

        {/* Partners / Compliance */}
        <div className="w-full max-w-5xl flex flex-wrap justify-center items-center gap-x-12 gap-y-8 border-t border-light-border pt-12">
          {["AS9100D CERTIFIED", "MIL-STD-810G COMPLIANT", "DGCA APPROVED", "ISO 27001 SECURE", "ITAR READY"].map((partner) => (
            <div key={partner} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4704D]/60" />
              <span className="text-[13px] md:text-[14px] font-mono tracking-[0.1em] text-light-muted/70 font-medium">
                {partner}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
