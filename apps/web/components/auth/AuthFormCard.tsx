import type { ReactNode } from "react";
import Link from "next/link";

interface AuthFormCardProps {
  activeTab: "login" | "register";
  children: ReactNode;
}

export function AuthFormCard({ activeTab, children }: AuthFormCardProps) {
  return (
    <div className="w-full max-w-[420px]">
      {/* Tab Switcher */}
      <div className="auth-tabs" role="tablist" aria-label="Authentication method">
        <Link
          href="/login"
          className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "login"}
          id="tab-sign-in"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "register"}
          id="tab-create-account"
        >
          Create Account
        </Link>
      </div>

      {children}
    </div>
  );
}
