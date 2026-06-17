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
      <HeroSection/>
    </div>
  );
}
