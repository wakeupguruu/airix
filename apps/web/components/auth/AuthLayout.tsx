import type { ReactNode } from "react";
import Link from "next/link";

/** SVG spark icon for the Airix logo mark */
function SparkIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Checkmark circle icon for the feature list */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="auth-feature-icon"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="var(--color-light-primary)" strokeWidth="1.5" />
      <path
        d="M5 8L7 10L11 6"
        stroke="var(--color-light-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-split bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      {/* ── Left Panel (Form) ──────────────────────────────────────── */}
      <div className="auth-form-panel bg-light-bg dark:bg-dark-bg">
        <Link href="/" className="auth-back" aria-label="Back to home">
          ← Back to home
        </Link>

        <div className="flex flex-col items-center w-full max-w-[420px]">
          {/* Mobile logo (visible when right panel is hidden) */}
          <div className="auth-mobile-logo">
            <SparkIcon size={22} className="text-light-primary" />
            <span
              className="text-[14px] font-bold tracking-[2.5px] text-light-text"
              style={{ fontFamily: "var(--font-inter-regular)" }}
            >
              AIRIX
            </span>
          </div>

          {children}
        </div>
      </div>

      {/* ── Right Panel (Brand) ────────────────────────────────────────── */}
      <div className="auth-brand-panel bg-light-surface dark:bg-dark-surface border-l border-light-border dark:border-dark-border">
        {/* Brand storytelling */}
        <div className="flex flex-col justify-center flex-1 relative">
          {/* Overline */}
          <p
            className="text-[10px] font-normal tracking-[0.15em] uppercase mb-4 text-light-muted dark:text-dark-muted"
          >
            / WHY AIRIX
          </p>

          {/* Headline */}
          <h1
            className="font-garamond-light text-[36px] leading-[1.10] mb-[16px] text-light-text dark:text-dark-text"
            style={{
              fontWeight: 400,
              letterSpacing: "-0.5px",
            }}
          >
            Built for India&apos;s Aerospace Future
          </h1>

          {/* Sub-headline */}
          <p
            className="text-[15px] leading-[1.60] mb-10 max-w-[340px] text-light-muted dark:text-dark-muted"
          >
            India&apos;s aerospace sector is accelerating. Airix is the modern toolchain built to power this wave.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text text-[14px] leading-[1.5] text-light-muted dark:text-dark-muted">
                <strong className="font-medium text-light-text dark:text-dark-text">Prompt-to-Prototype</strong>{" "}
                — describe your aircraft in plain language, and Airix generates a structured 3D model in seconds.
              </span>
            </div>
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text text-[14px] leading-[1.5] text-light-muted dark:text-dark-muted">
                <strong className="font-medium text-light-text dark:text-dark-text">Live Physics Dashboard</strong>{" "}
                — instant recalculation of drag coefficient, weight distribution, and stress limits.
              </span>
            </div>
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text text-[14px] leading-[1.5] text-light-muted dark:text-dark-muted">
                <strong className="font-medium text-light-text dark:text-dark-text">Predictive Maintenance</strong>{" "}
                — upload sensor telemetry to build a live health model that predicts component failures.
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="auth-testimonial border-t border-light-border dark:border-dark-border">
          <p className="auth-testimonial-quote text-light-muted dark:text-dark-muted m-0">
            &ldquo;Airix cut our concept-to-prototype time by 60%. It&rsquo;s the tool we
            didn&rsquo;t know we needed.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
