import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="overflow-x-auto rounded-2xl border border-emerald-900/10 bg-[#f7f8f0]"><table className={cn("w-full text-left text-sm [&_th]:px-5 [&_th]:py-4 [&_th]:font-semibold [&_td]:px-5 [&_td]:py-4 [&_thead]:bg-emerald-100/70 [&_tbody_tr]:border-t [&_tbody_tr]:border-emerald-900/10", className)} {...props} /></div>;
}
