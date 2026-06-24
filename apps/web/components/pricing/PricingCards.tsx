import Link from "next/link";
import { ReactNode } from "react";

export function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8L7 10L11 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PricingCardsProps {
  mode?: "public" | "subscription";
  currentPlan?: "Starter" | "Professional" | "Enterprise";
}

export function PricingCards({ mode = "public", currentPlan }: PricingCardsProps) {
  const getCardFooter = (tier: "Starter" | "Professional" | "Enterprise", isHighlight: boolean) => {
    if (mode === "public") {
      if (tier === "Enterprise") {
        return (
          <Link href="/contact" className="w-full text-center mt-6 bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors block">
            Contact Sales
          </Link>
        );
      }
      return (
        <Link href="/register" className={`w-full text-center mt-6 py-2.5 rounded-md font-medium transition-all block ${
          isHighlight 
            ? "bg-light-primary dark:bg-dark-primary text-white hover:opacity-90" 
            : "bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface"
        }`}>
          Get Started
        </Link>
      );
    }

    // Subscription Mode
    if (currentPlan === tier) {
      return (
        <div className="w-full text-center mt-6 py-2.5 rounded-md font-medium bg-light-surface dark:bg-dark-surface text-light-muted dark:text-dark-muted border border-light-secondary-border dark:border-dark-secondary-border">
          Current Plan
        </div>
      );
    }

    const tiers = ["Starter", "Professional", "Enterprise"];
    const currentIndex = currentPlan ? tiers.indexOf(currentPlan) : -1;
    const thisIndex = tiers.indexOf(tier);
    const isUpgrade = thisIndex > currentIndex;

    return (
      <button className={`w-full text-center mt-6 py-2.5 rounded-md font-medium transition-all ${
        isHighlight 
          ? "bg-light-primary dark:bg-dark-primary text-white hover:opacity-90" 
          : "bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface"
      }`}>
        {isUpgrade ? "Upgrade" : "Downgrade"}
      </button>
    );
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Starter */}
      <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-serif text-light-text dark:text-dark-text">Starter</h3>
          <div className="text-[40px] font-serif mt-2 text-light-text dark:text-dark-text">
            ₹0<span className="text-[18px] text-light-muted dark:text-dark-muted font-sans font-normal"> / month</span>
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-3 leading-relaxed">
            For solo and hobbyist engineers getting started with AI design.
          </p>
        </div>
        
        <ul className="space-y-4 text-[14px] flex-grow mt-2">
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 3 Design Workspaces</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 10 AI Image Generations / month</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 5 Text → 3D Models / month</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 1 Fleet Maintenance Workspace</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Basic Component Library (20 parts)</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 7 days Chat History</li>
        </ul>

        {getCardFooter("Starter", false)}
      </div>

      {/* Professional (Highlighted) */}
      <div className="relative p-8 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface flex flex-col gap-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full bg-light-primary text-white text-[12px] font-semibold tracking-wider uppercase shadow-sm whitespace-nowrap">
            Most Popular
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-serif text-light-text dark:text-dark-text mt-1">Professional</h3>
          <div className="text-[40px] font-serif mt-2 text-light-text dark:text-dark-text">
            ₹499<span className="text-[18px] text-light-muted dark:text-dark-muted font-sans font-normal"> / month</span>
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-3 leading-relaxed">
            For growing teams that need unlimited design freedom and deep diagnostics.
          </p>
        </div>
        
        <ul className="space-y-4 text-[14px] flex-grow mt-2">
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Unlimited Design Workspaces</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 100 AI Image Generations / month</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 50 Text → 3D Models / month</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 5 Fleet Maintenance Workspaces</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> GenAI Diagnostic Reports included</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> 3D Risk Map included</li>
        </ul>

        {getCardFooter("Professional", true)}
      </div>

      {/* Enterprise */}
      <div className="p-8 rounded-2xl border border-light-border dark:border-dark-border bg-transparent flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-serif text-light-text dark:text-dark-text">Enterprise</h3>
          <div className="text-[40px] font-serif mt-2 text-light-text dark:text-dark-text">
            ₹1,999<span className="text-[18px] text-light-muted dark:text-dark-muted font-sans font-normal"> / month</span>
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-3 leading-relaxed">
            For large organizations and fleet operators requiring full platform access.
          </p>
        </div>
        
        <ul className="space-y-4 text-[14px] flex-grow mt-2">
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Unlimited Design Workspaces</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Unlimited AI Image Generation</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Full + Custom Component Library</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Export (.glb, PDF)</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Unlimited Chat History</li>
          <li className="flex gap-3 text-light-text dark:text-dark-text leading-[1.4]"><span className="text-light-primary dark:text-dark-primary"><CheckIcon /></span> Priority Support included</li>
        </ul>

        {getCardFooter("Enterprise", false)}
      </div>
    </section>
  );
}
