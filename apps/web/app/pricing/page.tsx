import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { PricingCards } from "../../components/pricing/PricingCards";
import { FeatureComparisonTable } from "../../components/pricing/FeatureComparisonTable";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 space-y-20 md:space-y-32">
        {/* Top Section */}
        <section className="flex flex-col items-center text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-light-surface dark:bg-dark-surface text-[12px] font-medium border border-light-border dark:border-dark-border tracking-[0.15em] uppercase text-light-muted dark:text-dark-muted shadow-sm">
            / PLANS
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-serif font-normal leading-[1.05] tracking-[-1.5px] text-light-text dark:text-dark-text">
            Simple pricing.
          </h1>
          <p className="text-[16px] md:text-[18px] text-light-muted dark:text-dark-muted font-normal max-w-2xl leading-relaxed">
            Start free. Upgrade when you need more.
          </p>
        </section>

        {/* Pricing Cards */}
        <PricingCards mode="public" />

        {/* Feature Comparison Table */}
        <FeatureComparisonTable collapsible={false} />

      </div>
      <Footer />
    </main>
  );
}
