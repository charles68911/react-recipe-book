import { AuthHeader } from "@/components/features/auth/auth-header";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";

export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (ready && user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top,_#245c4c,_#102e28_65%)] px-4 py-12">
      <div className="w-full max-w-md">
        <AuthHeader />
        {ready ? (
          <Outlet />
        ) : (
          // Same glass card the login form uses, so the form fades into place
          // instead of the page jumping from an empty slot to a full card.
          <Card className="flex min-h-[300px] items-center justify-center p-10">
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-5">
              <Spinner />
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-900/60 uppercase">Loading</p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
