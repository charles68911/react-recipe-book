import { AuthContext } from "./auth-state";
import type { User } from "@/services/auth-service";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginService, logoutService, restoreSessionService, signupService } from "@/services/auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  // null means there is no signed-in user in the frontend state.
  const [user, setUser] = useState<User | null>(null);
  // Wait for the initial session check before deciding which page to show.
  const [ready, setReady] = useState(false);

  // useCallback keeps the same function between renders.
  // The service handles API requests; this provider stores the returned user.
  // const login = useCallback(async (email: string, password: string) => {
  //   const currentUser = await loginService(email, password);
  //   setUser(currentUser);
  //   setReady(true);
  //   // The login page uses this user's role to choose its next URL.
  //   return currentUser;
  // }, []);

  const login = useCallback(async (email: string, password: string) => {
  // Temporary demo login without a backend
  const isAdmin =
    email.trim().toLowerCase() === "admin@example.com";

  const currentUser: User = {
    id: isAdmin ? "demo-admin" : "demo-user",
    name: isAdmin ? "Demo Admin" : "Demo User",
    email: email.trim(),
    role: isAdmin ? "ADMIN" : "USER",
  };

  setUser(currentUser);
  setReady(true);

  // Save the demo session for page refreshes
  sessionStorage.setItem("demoUser", JSON.stringify(currentUser));

  return currentUser;
}, []);

  // The signup service creates the account and signs it in.
  const signup = useCallback(async (name: string, email: string, password: string) => {
    const currentUser = await signupService(name, email, password);
    setUser(currentUser);
    setReady(true);
    return currentUser;
  }, []);

  // Ask the API to clear its cookies and revoke the refresh token first.
const logout = useCallback(async () => {
  sessionStorage.removeItem("demoUser");
  setUser(null);
}, []);
  // Check for an existing cookie session when the provider first appears.
  useEffect(() => {
    // A request may finish after this provider is removed from the page.
    // Only update state while the provider is still present.
    let mounted = true;
    // The Axios client sends this event when automatic token refresh fails.
    function onExpired() {
      setUser(null);
    }

    window.addEventListener("auth:expired", onExpired);

   async function restoreSession() {
  try {
    const savedUser = sessionStorage.getItem("demoUser");

    if (savedUser && mounted) {
      setUser(JSON.parse(savedUser) as User);
    } else if (mounted) {
      setUser(null);
    }
  } catch {
    if (mounted) {
      setUser(null);
    }
  } finally {
    if (mounted) {
      setReady(true);
    }
  }
}

    restoreSession();

    // React calls this when the provider is removed (or the effect is rerun).
    function cleanup() {
      mounted = false;
      window.removeEventListener("auth:expired", onExpired);
    }

    return cleanup;
  }, []);

  // Reuse the shared object until one of its values changes.
  const value = useMemo(() => ({ user, ready, login, signup, logout }), [user, ready, login, signup, logout]);
  // Every child inside AuthProvider can now access these values.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}