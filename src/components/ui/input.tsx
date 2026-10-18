import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn(
          `
          h-12
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-4
          text-sm
          text-slate-900
          outline-none
          transition-all
          placeholder:text-slate-400
          focus:border-emerald-600
          focus:bg-white
          focus:ring-4
          focus:ring-emerald-50
          `,
          error && "border-red-500",
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}