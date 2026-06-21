"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Disable Lenis on Auth pages since they use a 100vh flex layout
  // which conflicts with Lenis's resize observer and causes sluggish scrolling.
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
