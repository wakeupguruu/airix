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
    <div className="auth-split">
      {/* ── Left Panel (Dark) ────────────────────────────────────────── */}
      <div className="auth-left">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <SparkIcon size={22} className="text-light-primary" />
          <span
            className="text-[14px] font-bold tracking-[2.5px] text-light-bg"
            style={{ fontFamily: "var(--font-inter-regular)" }}
          >
            AIRIX
          </span>
        </div>

        {/* Brand storytelling */}
        <div className="flex flex-col justify-center flex-1 relative">
          {/* Ghost watermark */}
          <span className="auth-watermark" aria-hidden="true">
            AIR
          </span>

          {/* Overline */}
          <p
            className="text-[10px] font-normal tracking-[0.5px] uppercase mb-4"
            style={{ color: "var(--color-light-primary)" }}
          >
            AEROSPACE AI PLATFORM
          </p>

          {/* Headline */}
          <h1
            className="font-garamond-light text-[36px] leading-[1.30] mb-[14px]"
            style={{
              color: "var(--color-light-bg)",
              fontWeight: 400,
              letterSpacing: "-0.5px",
            }}
          >
            From concept to mesh.
          </h1>

          {/* Sub-headline */}
          <p
            className="text-[16px] leading-[1.60] mb-10 max-w-[300px]"
            style={{ color: "var(--color-warm-silver)" }}
          >
            AI-native aerospace design for the next generation of engineers.
          </p>

          {/* Feature list */}
          <div>
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text">
                <strong className="font-medium text-dark-muted">Text → 4 Images → 3D Model</strong>{" "}
                — generate photorealistic renders from a single description
              </span>
            </div>
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text">
                <strong className="font-medium text-dark-muted">Aerospace-Grade Precision</strong>{" "}
                — production-ready mesh files, millimetre accuracy
              </span>
            </div>
            <div className="auth-feature-item">
              <CheckIcon />
              <span className="auth-feature-text">
                <strong className="font-medium text-dark-muted">GenAI Diagnostic Reports</strong>{" "}
                — AI-powered fleet maintenance and analytics
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="auth-testimonial">
          <p className="auth-testimonial-quote">
            &ldquo;Airix cut our concept-to-prototype time by 60%. It&rsquo;s the tool we
            didn&rsquo;t know we needed.&rdquo;
          </p>
          <div className="auth-testimonial-attribution">
            <div className="auth-testimonial-avatar">RK</div>
            <div>
              <div className="auth-testimonial-name">Rajan Kapoor</div>
              <div className="auth-testimonial-role">
                Senior Aerospace Engineer, IIT Delhi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Light) ──────────────────────────────────────── */}
      <div className="auth-right">
        <Link href="/" className="auth-back" aria-label="Back to home">
          ← Back to home
        </Link>

        <div className="flex flex-col items-center w-full max-w-[420px]">
          {/* Mobile logo (visible when left panel is hidden) */}
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
    </div>
  );
}
