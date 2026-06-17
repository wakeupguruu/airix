"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Navbar } from "../components/home/Navbar";
import { HeroSection } from "../components/home/HeroSection";


export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-300 font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full text-light-text dark:text-dark-text">
        <HeroSection />
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl tracking-tight leading-tight font-serif">
            Welcome to <span className="text-light-primary dark:text-dark-primary">Airix</span>
          </h1>
          
          <p className="text-lg md:text-xl text-light-muted dark:text-dark-muted font-sans">
            The warmest, most editorial interface in the AI-product category.
          </p>

          <div className="pt-8 flex gap-4 justify-center">
            <Link 
              href="/design" 
              className="px-6 py-3 rounded-md font-medium transition-all bg-light-primary text-white hover:opacity-90 dark:bg-dark-primary"
            >
              View Design System
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-6 py-3 rounded-md font-medium transition-all bg-transparent border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface"
              >
                Toggle {theme === "dark" ? "Light" : "Dark"} Mode
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
