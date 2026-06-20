import { FeaturesScene } from "../3d/home/FeaturesScene";

const FEATURES_DATA = [
  {
    title: "Prompt-to-Prototype",
    description:
      "Describe your aircraft in plain language, and Airix reasons about aerodynamics and physics to generate a structured 3D model in seconds.",
  },
  {
    title: "Live Physics Dashboard",
    description:
      "Instant recalculation of drag coefficient, weight distribution, and structural stress limits with every component swap.",
  },
  {
    title: "Predictive Maintenance",
    description:
      "Upload sensor telemetry to build a live health model that predicts component failures weeks in advance.",
  },
  {
    title: "Configuration Export",
    description:
      "Export full component specifications and manufacturing cost breakdowns directly to your procurement pipeline.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-12 lg:py-16 px-10 md:px-14 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="mb-12">
          <div className="max-w-2xl">
            <span className="text-[12px] font-medium tracking-[0.15em] text-light-muted dark:text-dark-muted uppercase mb-4 block font-sans">
              / Intelligent Engineering
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-garamond-dark font-normal leading-[1.05] tracking-[-1px]">
              Innovation that accelerates your design cycle
            </h2>
          </div>
        </div>

        {/* Content: Left Image + Right Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Wireframe Preview Panel */}
          <div className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] rounded-2xl overflow-hidden relative border border-light-border dark:border-dark-border">
            <div className="absolute inset-0 bg-dark-bg flex flex-col">
              {/* Window Chrome */}
              <div className="h-10 border-b border-dark-border flex items-center px-4 gap-2 bg-dark-surface shrink-0">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <span className="ml-auto text-[11px] text-dark-muted font-sans tracking-wide">viewport.airix</span>
              </div>
              {/* Grid Area */}
              <div className="flex-grow relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="features-grid-static" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#features-grid-static)" />
                  </svg>
                </div>

                {/* Coral Glow Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-light-primary rounded-full blur-3xl opacity-20 z-0"></div>

                {/* 3D Wireframe Model */}
                <FeaturesScene />

                {/* Bottom HUD */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-dark-surface/80 backdrop-blur-md border border-dark-border rounded-xl p-3 flex justify-between items-center">
                    <span className="text-[12px] font-medium font-sans text-dark-text">Jet Engine Turbine</span>
                    <span className="text-[10px] uppercase tracking-widest text-light-primary font-bold font-sans">Wireframe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 2x2 Minimalistic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 lg:pl-4">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="flex flex-col border-t border-light-border dark:border-dark-border pt-6">
                <div className="text-light-primary dark:text-dark-primary font-garamond-dark text-xl mb-3 italic">
                  0{index + 1}
                </div>
                <h3 className="text-[18px] font-medium font-sans mb-3 text-light-text dark:text-dark-text">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-light-muted dark:text-dark-muted font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
