import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        `
        overflow-hidden
        rounded-[30px]
        border border-white/20
        bg-white/90
        backdrop-blur-xl
        shadow-[0_30px_80px_rgba(0,0,0,.25)]
        `,
        className
      )}
    >
      {children}
    </div>
  );
}