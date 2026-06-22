"use client";

import { useState } from "react";

interface FeatureComparisonTableProps {
  collapsible?: boolean;
}

export function FeatureComparisonTable({ collapsible = false }: FeatureComparisonTableProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  return (
    <section className="flex flex-col space-y-10 pb-16">
      {collapsible ? (
        <div className="text-center border-t border-light-border dark:border-dark-border pt-10">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-light-primary dark:text-dark-primary hover:opacity-80 transition-opacity"
          >
            Show full comparison {isExpanded ? "▴" : "▾"}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-serif text-light-text dark:text-dark-text">Compare Features</h2>
        </div>
      )}
      
      {isExpanded && (
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border">
                <th className="py-4 pr-6 text-[12px] font-medium tracking-[0.15em] uppercase text-light-muted dark:text-dark-muted">Feature</th>
                <th className="py-4 px-6 text-center text-[12px] font-medium tracking-[0.15em] uppercase text-light-muted dark:text-dark-muted w-[22%]">Starter</th>
                <th className="py-4 px-6 text-center text-[12px] font-medium tracking-[0.15em] uppercase text-light-muted dark:text-dark-muted w-[22%]">Pro</th>
                <th className="py-4 px-6 text-center text-[12px] font-medium tracking-[0.15em] uppercase text-light-muted dark:text-dark-muted w-[22%]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Design Workspaces</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">3</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">AI Image Generation</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">10 / month</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">100 / month</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Text → 3D Models</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">5 / month</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">50 / month</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Fleet Maintenance Workspaces</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">1</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">5</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">GenAI Diagnostic Reports</td>
                <td className="py-4 px-6 text-center text-light-muted dark:text-dark-muted">—</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">3D Risk Map</td>
                <td className="py-4 px-6 text-center text-light-muted dark:text-dark-muted">—</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Component Library</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Basic (20 parts)</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Full</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Full + Custom</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Export (.glb, PDF)</td>
                <td className="py-4 px-6 text-center text-light-muted dark:text-dark-muted">—</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Chat History</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">7 days</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">90 days</td>
                <td className="py-4 px-6 text-center text-light-text dark:text-dark-text">Unlimited</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-4 pr-6 text-light-text dark:text-dark-text font-medium">Priority Support</td>
                <td className="py-4 px-6 text-center text-light-muted dark:text-dark-muted">—</td>
                <td className="py-4 px-6 text-center text-light-muted dark:text-dark-muted">—</td>
                <td className="py-4 px-6 text-center text-light-primary dark:text-dark-primary">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
