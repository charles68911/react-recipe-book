import { useState } from "react";
import { LogOut } from "lucide-react";
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

  return (
    <Section>
      <PageHeader eyebrow="Recipe Book · Administration" title="All recipes" description="Browse recipes across every account.">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-emerald-100/80">{user?.name}</span>
          <Button variant="secondary" onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full">
            <LogOut size={15} />
            Sign out
          </Button>
        </div>
      </PageHeader>

      {error && <p role="alert" className="mb-6 text-sm text-red-200">{error}</p>}

      <AdminRecipes />
    </Section>
  );
}
