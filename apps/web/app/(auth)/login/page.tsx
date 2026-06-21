"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthFormCard } from "../../../components/auth/AuthFormCard";
import { AuthInput } from "../../../components/auth/AuthInput";

/** Full-color Google "G" logo */
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  function handleSignIn() {
    // Front-end mock — redirect to home on click
    router.push("/");
  }

  return (
    <AuthLayout>
      <AuthFormCard>
        {/* Heading */}
        <h1
          className="auth-card-heading font-garamond-light"
          style={{
            fontSize: "32px",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.3px",
            color: "var(--color-light-text)",
            margin: 0,
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--color-light-muted)",
            marginTop: "8px",
            marginBottom: "28px",
            lineHeight: 1.55,
          }}
        >
          Sign in to your Airix workspace.
        </p>

        {/* Email */}
        <AuthInput
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={setEmail}
        />

        {/* Password */}
        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          showPasswordToggle
          rightLabel={{ text: "Forgot password?", href: "#" }}
        />

        {/* Remember me */}
        <div className="auth-checkbox-group">
          <input
            type="checkbox"
            id="login-remember"
            className="auth-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="login-remember" className="auth-checkbox-label">
            Remember me for 30 days
          </label>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="auth-btn-primary"
          id="login-submit"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or continue with</span>
          <div className="auth-divider-line" />
        </div>

        {/* Google SSO */}
        <button type="button" className="auth-btn-google" id="login-google">
          <GoogleLogo />
          Continue with Google
        </button>

        {/* Switch to Register */}
        <div className="auth-switch">
          Don&rsquo;t have an account?{" "}
          <Link href="/register">Create one free</Link>
        </div>
      </AuthFormCard>
    </AuthLayout>
  );
}
