import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

// Shared page heading. Optional children provide actions such as Sign out.
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-emerald-950 p-6 text-amber-50 sm:p-8">
      <div>
        <p className="text-xs tracking-widest text-emerald-200 uppercase">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-emerald-100/80">{description}</p>
      </div>
      {children}
    </header>
  );
}
