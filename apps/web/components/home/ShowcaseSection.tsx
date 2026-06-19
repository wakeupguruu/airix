"use client";

import { Wind, Activity, Layers, Download } from "lucide-react";

export function ShowcaseSection() {
  const cards = [
    {
      title: "UAVs & Drones",
      description: "Autonomous unmanned aerial vehicles optimized for surveillance, delivery, and reconnaissance missions.",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      pills: ["Surveillance", "Delivery", "Multi-Rotor"],
    },
    {
      title: "Fighter Jets",
      description: "Fifth-generation stealth fighters with optimized radar cross-section and advanced avionics.",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80",
      pills: ["Mach 1.8+", "Stealth Design", "Combat Ready"],
    },
    {
      title: "Commercial Transport",
      description: "Wide-body commercial transports designed for maximum fuel efficiency and passenger comfort.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      pills: ["90+ Passengers", "Fuel Efficient", "Short-Haul"],
    },
  ];

  const features = [
    { label: "AI-Optimized Aerodynamics", icon: Wind },
    { label: "Real-Time Physics", icon: Activity },
    { label: "Component Library", icon: Layers },
    { label: "Export Ready", icon: Download },
  ];

  return (
    <section className="w-full py-16 lg:py-24 px-10 md:px-14 bg-light-bg text-[#1A1A1A] font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        
        {/* Header */}
        <div className="mb-14">
          <span className="text-[11px] font-bold tracking-[0.15em] text-light-muted uppercase mb-4 block font-sans">
            / Design Anything
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.05] tracking-[-1px] text-[#1A1A1A]">
            One Platform. Every Aircraft.
          </h2>
        </div>

        {/* Scrollable Cards Row */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="min-w-[320px] md:min-w-[380px] flex-1 bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden snap-start flex flex-col"
            >
              <div className="relative w-full h-56 md:h-64 overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-[22px] font-bold font-sans mb-3 text-[#1A1A1A]">{card.title}</h3>
                <p className="text-[15px] text-light-muted leading-relaxed font-sans flex-1 mb-6">
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {card.pills.map((pill, pIdx) => (
                    <span 
                      key={pIdx} 
                      className="px-3 py-1 bg-[#C4704D] text-white text-[12px] font-medium rounded-full tracking-wide"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-t border-light-border my-12" />

        {/* Bottom Features */}
        <div className="flex flex-wrap items-center justify-between gap-6 md:gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C4704D]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#C4704D]" />
                </div>
                <span className="text-[15px] font-medium font-sans text-[#1A1A1A]">{feature.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
