"use client";

import { Globe2, Cpu, Wrench, ShieldCheck, Activity, Radio } from "lucide-react";

const benefitsData = [
  {
    title: "Global Reach",
    icon: Globe2,
    desc: "With a cloud network, engineering teams collaborate seamlessly from anywhere. Share and review massive 3D models without heavy local hardware.",
  },
  {
    title: "Custom Workspaces",
    icon: Cpu,
    desc: "Generate specialized models from text or images. Tailor your physics engines and aerodynamic environments to fit your exact specifications.",
  },
  {
    title: "Predictive Tools",
    icon: Wrench,
    desc: "Enable real-time failure prediction using raw sensor data and AI analytics. Prevent mechanical failures by simulating thousands of stress tests.",
  },
  {
    title: "Proven Accuracy",
    icon: ShieldCheck,
    desc: "We perfect the art of modeling stress, drag, and weight distribution. Our algorithms match real-world wind tunnel data with over 99% fidelity.",
  },
  {
    title: "Dynamic Scaling",
    icon: Activity,
    desc: "Scale computational resources automatically during intensive simulation tasks. Focus purely on engineering design without worrying about infrastructure bottlenecks.",
  },
  {
    title: "Real-Time Telemetry",
    icon: Radio,
    desc: "Connect live sensor data from test flights directly into digital twin environments. Analyze aerodynamic performance in real time to speed up production.",
  },
];

interface BenefitCardProps {
  title: string;
  icon: React.ElementType;
  desc: string;
}

function BenefitCard({ title, icon: Icon, desc }: BenefitCardProps) {
  return (
    <div className="relative bg-light-bg dark:bg-dark-bg p-8 lg:p-10 flex flex-col overflow-hidden group">
      
      {/* 
        Simple, flawless CSS transition hover. 
        Uses an incredibly fine 8x8 pixel grid (much smaller than before) 
        and a tiny hint of solid orange background for depth.
      */}
      <div 
        className="absolute inset-0 bg-[#F97316]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='rgba(249, 115, 22, 0.25)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10 pointer-events-none">
        <Icon className="mb-8 text-light-text dark:text-dark-text stroke-[1.5] group-hover:scale-110 transition-transform duration-500" size={20} />
        <h3 className="text-[18px] font-medium font-sans mb-3 text-light-text dark:text-dark-text">{title}</h3>
        <p className="text-[15px] leading-relaxed text-light-muted dark:text-dark-muted">{desc}</p>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  return (
    <section className="w-full py-12 lg:py-16 px-10 md:px-14 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <div className="w-full flex flex-col">
        
        {/* Header */}
        <div className="mb-12 flex flex-col max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase mb-4 block">
            / WHY CHOOSE AIRIX
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.05] tracking-[-1px]">
            We specialize in providing reliable and intelligent design solutions
          </h2>
        </div>

        {/* 3x2 Grid with Internal Borders Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-light-border dark:bg-dark-border gap-[1px]">
          {benefitsData.map((benefit, i) => (
            <BenefitCard key={i} {...benefit} />
          ))}
        </div>

      </div>
    </section>
  );
}
