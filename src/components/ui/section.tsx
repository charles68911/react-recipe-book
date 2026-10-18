import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
};

export function Section({ children }: SectionProps) {
  // Shared page width, background, and responsive padding keep every screen aligned.
  return (
    <section className="min-h-svh bg-[radial-gradient(ellipse_at_top,_#245c4c,_#102e28_65%)]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </div>
    </section>
  );
}
