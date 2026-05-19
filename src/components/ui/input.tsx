import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-colors",
        "border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] text-[var(--auth-input-text)]",
        "placeholder:text-[var(--auth-input-placeholder)]",
        "focus:border-bao-light focus:outline-none focus:ring-2 focus:ring-bao/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
