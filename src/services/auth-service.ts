import { clearCsrfToken, ensureCsrfToken, http } from "@/lib/axios";

export type User = { id: string; name: string; email: string; role: string; emailVerified: boolean };

// Get Session Service
async function getSessionService() {
  const response = await http.get("/auth/v1/session");
  return response.data.data.user as User;
}

// User Login Service
export async function loginService(email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/login", { email, password });
  await ensureCsrfToken();
  return getSessionService();
}

// Create an Account - Signup Service
export async function signupService(name: string, email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/signup", { name, email, password });
  return loginService(email, password);
}

// Logout to the app
export async function logoutService() {
  await http.post("/auth/v1/logout", {});
  clearCsrfToken();
}

// Refresh Token Service
export async function restoreSessionService() {
  await ensureCsrfToken();
  await http.post("/auth/v1/refresh-token", {});
  await ensureCsrfToken();
  return getSessionService();
}