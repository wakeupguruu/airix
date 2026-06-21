import type { ReactNode } from "react";

interface AuthFormCardProps {
  children: ReactNode;
}

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="w-full max-w-[420px]">
      {children}
    </div>
  );
}
