import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-indigo-700 text-khadi-50 hover:bg-indigo-900 disabled:bg-indigo-700/40",
  secondary: "bg-transparent text-indigo-900 border border-indigo-700/40 hover:bg-indigo-300/20",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-900/5",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`h-12 min-w-[7rem] rounded-lg px-6 text-base font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    />
  );
}
