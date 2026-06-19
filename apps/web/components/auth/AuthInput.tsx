"use client";

import { useState, useId } from "react";

/** Eye-open icon for password visibility toggle */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Eye-off icon for password visibility toggle */
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

interface AuthInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rightLabel?: {
    text: string;
    href?: string;
  };
  hasError?: boolean;
  errorMessage?: string;
  showPasswordToggle?: boolean;
}

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightLabel,
  hasError = false,
  errorMessage,
  showPasswordToggle = false,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const errorId = useId();

  const inputType = showPasswordToggle
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

  return (
    <div className="auth-input-group">
      {rightLabel ? (
        <div className="auth-label-row">
          <label htmlFor={id} className="auth-label">
            {label}
          </label>
          {rightLabel.href ? (
            <a href={rightLabel.href} className="auth-label-link">
              {rightLabel.text}
            </a>
          ) : (
            <span className="auth-label-link" role="button" tabIndex={0}>
              {rightLabel.text}
            </span>
          )}
        </div>
      ) : (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      )}

      <div className="auth-input-wrapper">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`auth-input ${hasError ? "error" : ""}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : undefined}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {errorMessage && (
        <p
          id={errorId}
          className={`auth-error-text ${hasError ? "visible" : ""}`}
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
