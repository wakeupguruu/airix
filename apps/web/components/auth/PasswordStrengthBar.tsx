"use client";

interface PasswordStrengthBarProps {
  password: string;
}

interface StrengthLevel {
  width: string;
  color: string;
  text: string;
}

const STRENGTH_LEVELS: StrengthLevel[] = [
  { width: "0%", color: "var(--color-light-secondary-border)", text: "" },
  { width: "25%", color: "var(--color-warm-silver)", text: "Too weak" },
  { width: "50%", color: "var(--color-light-primary)", text: "Fair" },
  { width: "75%", color: "var(--color-light-primary-active)", text: "Good" },
  { width: "100%", color: "#6a8f5e", text: "Strong" },
];

function computeStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const score = computeStrengthScore(password);
  const level = STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[0];

  return (
    <div>
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{ width: level.width, background: level.color }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={`Password strength: ${level.text || "empty"}`}
        />
      </div>
      <div className="strength-label">{level.text}</div>
    </div>
  );
}
