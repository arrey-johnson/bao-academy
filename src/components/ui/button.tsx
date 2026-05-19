import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-bao text-white hover:bg-bao-hover shadow-sm shadow-bao/25",
  secondary:
    "border border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface-card-hover)]",
  ghost:
    "text-[var(--text-secondary)] hover:bg-[var(--surface-card-hover)] hover:text-[var(--foreground)]",
  outline:
    "border border-[var(--surface-border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)] hover:border-[var(--bao-primary-light)]",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
