import { useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { PageHeader } from "@/components/common/page-header";
import { AdminRecipes } from "@/components/features/admin/admin-recipes";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  const initials = (user?.name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Section>
      <PageHeader
        eyebrow="Recipe Book · Administration"
        title="Kitchen oversight"
        description="Every recipe saved across all home kitchens."
      >
        {/* Signed-in administrator, shown the same way a real admin console would. */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 backdrop-blur-xl">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md"
            >
              {initials || "?"}
            </span>

            <span className="leading-tight">
              <span className="block max-w-40 truncate text-sm font-semibold text-white">
                {user?.name}
              </span>
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-200/80">
                <ShieldCheck size={12} aria-hidden />
                Administrator
              </span>
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </Button>
        </div>
      </PageHeader>

      {error && (
        <p role="alert" className="mb-6 text-sm text-red-200">
          {error}
        </p>
      )}

      <AdminRecipes />
    </Section>
  );
}