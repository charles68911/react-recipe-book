import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type CardProps = { children: ReactNode; className?: string };
export function Card({ children, className }: CardProps) {
  return <div className={cn("border border-emerald-900/10 rounded-2xl overflow-hidden bg-[#f7f8f0] shadow-sm", className)}>{children}</div>;
}
