import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-bao text-white hover:bg-bao-hover shadow-sm shadow-bao/25",
  secondary: "bg-bao-dark text-zinc-100 hover:bg-zinc-700",
  ghost:
    "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 light:text-zinc-700 light:hover:bg-zinc-100 light:hover:text-zinc-900",
  outline:
    "border border-zinc-700 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-600 light:border-zinc-300 light:text-zinc-800 light:hover:bg-zinc-50",
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
