import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
  children: ReactNode;
};

const variants = {
  primary:"bg-emerald-700 text-white hover:bg-emerald-800",
  secondary: "border border-emerald-900/20 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  tertiary: "text-emerald-800 hover:text-emerald-950",
};

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn("cursor-pointer rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
