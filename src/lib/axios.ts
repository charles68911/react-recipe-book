import axios from "axios";

// Vite reads VITE_ variables from the frontend's .env file.
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("Set VITE_API_BASE_URL in the frontend .env file.");
}

// Services share this client. The browser sends the API's HttpOnly cookies;
// JavaScript does not need to read or save access/refresh tokens.
export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Keep the CSRF token in memory. It proves that a write request came from
// a client that fetched a token for the current cookie session.
let csrfToken: string | null = null;

// Several requests can fail together. They must share one refresh operation
// because the API consumes the old refresh token when issuing a new one.
let refreshPromise: Promise<void> | null = null;

const writeMethods = ["post", "put", "patch", "delete"];
const authEndpoints = [
  "/auth/v1/login",
  "/auth/v1/signup",
  "/auth/v1/refresh-token",
  "/auth/v1/logout",
];

function isAuthEndpoint(url = "") {
  return authEndpoints.includes(url);
}

export function clearCsrfToken() {
  csrfToken = null;
}

export async function ensureCsrfToken() {
  if (csrfToken) return;

  // Plain axios avoids running this client's interceptors for the token fetch.
  const response = await axios.get(`${baseURL}/auth/v1/csrf-token`, {
    withCredentials: true,
  });
  csrfToken = response.data.data.csrfToken as string;
}

async function refreshSession() {
  await http.post("/auth/v1/refresh-token", {});
  // The response interceptor clears the old CSRF token because cookies changed.
  await ensureCsrfToken();
}

// Before sending: attach CSRF protection to requests that can change data.
http.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() || "get";

  if (writeMethods.includes(method)) {
    await ensureCsrfToken();
    config.headers.set("x-csrf-token", csrfToken);
  }

  return config;
});

http.interceptors.response.use(
  // Successful auth requests can change cookies, invalidating the CSRF token.
  (response) => {
    if (isAuthEndpoint(response.config.url)) clearCsrfToken();
    return response;
  },
  async (error) => {
    const request = error.config;

    // Refresh only on 401 (unauthorized), and retry each request at most once.
    // Auth endpoints handle their own errors; refreshing them would cause loops.
    if (!request || error.response?.status !== 401) throw error;
    if (request._retry || isAuthEndpoint(request.url)) throw error;

    // _retry is our custom Axios flag, declared in src/types/axios.d.ts.
    request._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
    } catch (refreshError) {
      clearCsrfToken();
      // AuthProvider listens for this event and shows the signed-out UI.
      window.dispatchEvent(new Event("auth:expired"));
      throw refreshError;
    }

    // Cookies now contain the rotated tokens. The request interceptor also
    // replaces any old CSRF header before sending the original request again.
    return http(request);
  },
);