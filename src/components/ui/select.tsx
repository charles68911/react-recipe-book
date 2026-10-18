import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div>
      <div className="relative">
        <select
          className={cn(
            `
            h-12
            w-full
            cursor-pointer
            appearance-none
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            pl-4
            pr-11
            text-sm
            text-slate-900
            outline-none
            transition-all
            hover:border-emerald-300
            hover:bg-white
            focus:border-emerald-600
            focus:bg-white
            focus:ring-4
            focus:ring-emerald-50
            disabled:cursor-not-allowed
            disabled:opacity-60
            `,
            error && "border-red-500",
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {children}
        </select>

        {/* The native arrow can't be styled, so we hide it and draw our own */}
        <ChevronDown
          size={18}
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-700/60"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
