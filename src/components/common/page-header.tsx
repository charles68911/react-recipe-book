import type { ReactNode } from "react";
import { CookingPot } from "lucide-react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

// Shared page heading. Optional children provide actions such as Sign out.
// Styled to match the login page: bold sans-serif title, emerald accents.
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        {/* Same emerald gradient as the "Continue" button */}
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-black/25 ring-1 ring-white/20 sm:h-20 sm:w-20 sm:rounded-3xl"
        >
          <CookingPot className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.2} />
        </span>

        <div>
          <p className="text-sm font-medium text-emerald-200">{eyebrow}</p>

          <h1 className="mt-0.5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-1.5 text-sm text-emerald-100/80 sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {children}
    </header>
  );
}