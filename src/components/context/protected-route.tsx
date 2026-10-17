import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

// Wrap routes with this component to limit which users can see their pages.
// The role prop is the role required by those routes: USER or ADMIN.
// The API also checks permissions; frontend checks alone cannot secure data.
export function ProtectedRoute({ role }: { role: "USER" | "ADMIN" }) {
  const { user, ready } = useAuth();
  // Wait for the cookie session check so a signed-in user is not sent to login.
  if (!ready) return null;
  // No user means the visitor needs to sign in.
  // replace removes this redirect from browser history to avoid a Back loop.
  if (!user) return <Navigate to="/auth/login" replace />;
  // A signed-in user with the wrong role goes to their own home page.
  if (user.role !== role) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  // Outlet renders the matching child route declared in main.tsx.
  return <Outlet />;
}

// Visiting / (or an unknown URL) sends the visitor to the appropriate home page.
export function HomeRedirect() {
  const { user, ready } = useAuth();
  // Decide where to go only after the initial session check finishes.
  if (!ready) return null;
  // Signed out -> login, ADMIN -> admin area, USER -> personal recipe book.
  return <Navigate to={!user ? "/auth/login" : user.role === "ADMIN" ? "/admin" : "/user"} replace />;
}