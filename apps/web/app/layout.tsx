import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "@repo/ui/styles.css";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { SmoothScroll } from "../components/SmoothScroll";

const EB_Graramond_dark = EB_Garamond({
  variable: "--font-eb-garamond-dark",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

const EB_Graramond_light = EB_Garamond({
  variable: "--font-eb-garamond-light",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
})

const inter_regular = Inter({
  variable: "--font-inter-regular",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const inter_bold = Inter({
  variable: "--font-inter-bold",
  subsets: ["latin"],
  weight: ["700", "800"],
})

export const metadata: Metadata = {
  title: "Airix — AI-Powered Aerospace Design",
  description: "Design aircraft, fighter jets, and drones with generative AI. Prompt-to-prototype, physics simulation, and predictive maintenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${EB_Graramond_dark.variable} ${EB_Graramond_light.variable} ${inter_regular.variable} ${inter_bold.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
