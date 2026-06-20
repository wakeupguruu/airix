"use client";

import { Navbar } from "../components/home/Navbar";
import { HeroSection } from "../components/home/HeroSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { BenefitsSection } from "../components/home/BenefitsSection";
import { PipelineSection } from "../components/home/PipelineSection";
import { ShowcaseSection } from "../components/home/ShowcaseSection";
import { ImpactSection } from "../components/home/ImpactSection";
import { Footer } from "../components/home/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-300 font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PipelineSection />
      <ShowcaseSection />
      <ImpactSection />
      <Footer />
    </div>
  );
}
