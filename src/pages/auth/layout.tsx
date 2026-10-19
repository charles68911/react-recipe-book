import { AuthHeader } from "@/components/features/auth/auth-header";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { PageLoader } from "@/components/ui/loader";

export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (ready && user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  // The whole page waits behind the loader while the session check runs,
  // then the form fades in after it.
  if (!ready) return <PageLoader />;
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top,_#245c4c,_#102e28_65%)] px-4 py-12">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Outlet />
      </div>
    </main>
  );
}
