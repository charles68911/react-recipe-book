import { CookingPot } from "lucide-react";
import { cn } from "@/lib/cn";

type SpinnerProps = {
  className?: string;
  // Dark surfaces need the lighter ring and icon to stay visible.
  onDark?: boolean;
};

// Purely decorative ring. The element around it announces the loading state,
// so screen readers are told once instead of on every spinner.
export function Spinner({ className, onDark = false }: SpinnerProps) {
  return (
    <span aria-hidden="true" className={cn("relative flex h-16 w-16 items-center justify-center", className)}>
      <span className={cn("absolute inset-0 rounded-full border-2", onDark ? "border-white/15" : "border-emerald-900/10")} />
      <span
        className={cn(
          "absolute inset-0 animate-spin rounded-full border-2 border-transparent",
          onDark ? "border-t-emerald-400 border-r-emerald-400" : "border-t-emerald-600 border-r-emerald-600",
        )}
      />
      <CookingPot className={cn("h-6 w-6", onDark ? "text-emerald-200" : "text-emerald-700")} />
    </span>
  );
}

// Full page loader for routes that cannot render until the session check ends.
export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,_#245c4c,_#102e28_65%)] px-4"
    >
      <Spinner onDark />
      <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100/70 uppercase">Loading</p>
    </div>
  );
}
