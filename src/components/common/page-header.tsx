import type { ReactNode } from "react";
import { CookingPot } from "lucide-react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

// Shared page heading. Optional children provide actions such as Sign out.
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-50 backdrop-blur-sm">
          <CookingPot size={24} />
        </span>
        <div>
          <p className="text-xs font-medium tracking-widest text-emerald-200 uppercase">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-amber-50 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-emerald-100/80">{description}</p>
        </div>
      </div>
      {children}
    </header>
  );
}
