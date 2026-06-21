import Link from "next/link";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";

function CheckIcon() {
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

            <Link href="/register" className="w-full text-center mt-6 bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors block">
              Get Started
            </Link>
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

            <Link href="/register" className="w-full text-center mt-6 bg-light-primary dark:bg-dark-primary text-white py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity block">
              Get Started
            </Link>
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

            <Link href="/contact" className="w-full text-center mt-6 bg-transparent border border-light-secondary-border dark:border-dark-secondary-border text-light-text dark:text-dark-text py-2.5 rounded-md font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors block">
              Contact Sales
            </Link>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="flex flex-col space-y-10 pb-16">
          <div className="text-center">
             <h2 className="text-3xl font-serif text-light-text dark:text-dark-text">Compare Features</h2>
          </div>
          
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
        </section>

      </div>
      <Footer />
    </main>
  );
}
