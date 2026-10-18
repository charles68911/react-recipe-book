
import axios from "axios";

// Read the Vite environment variable and remove trailing slashes.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = rawBaseURL?.replace(/\/+$/, "");

if (!baseURL) {
  throw new Error("Set VITE_API_BASE_URL in your frontend environment variables.");
}

// Your backend mounts all routes under /api.
const API_PREFIX = "/api";
const AUTH_PREFIX = `${API_PREFIX}/auth/v1`;

// Services share this client. Cookies are sent automatically by the browser.
export const http = axios.create({
  baseURL: `${baseURL}${API_PREFIX}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let csrfToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

const writeMethods = ["post", "put", "patch", "delete"];

const authEndpoints = [
  `${AUTH_PREFIX}/login`,
  `${AUTH_PREFIX}/signup`,
  `${AUTH_PREFIX}/refresh-token`,
  `${AUTH_PREFIX}/logout`,
];

function isAuthEndpoint(url = "") {
  // Axios request URLs may be absolute or relative.
  const path = url.startsWith("http")
    ? new URL(url).pathname
    : url;

  return authEndpoints.some(
    (endpoint) => path.replace(/\/+$/, "") === endpoint,
  );
}

export function clearCsrfToken() {
  csrfToken = null;
}

export async function ensureCsrfToken() {
  if (csrfToken) return;

  // Fetch the CSRF token without running this client's interceptors.
  const response = await axios.get(
    `${baseURL}${AUTH_PREFIX}/csrf-token`,
    { withCredentials: true },
  );

  csrfToken = response.data.data.csrfToken as string;
}

async function refreshSession() {
  await http.post(`${AUTH_PREFIX}/refresh-token`, {});
  await ensureCsrfToken();
}

// Attach CSRF protection to requests that can change data.
http.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() || "get";

  if (writeMethods.includes(method)) {
    await ensureCsrfToken();
    config.headers.set("x-csrf-token", csrfToken);
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    if (isAuthEndpoint(response.config.url)) {
      clearCsrfToken();
    }

    return response;
  },
  async (error) => {
    const request = error.config;

    if (!request || error.response?.status !== 401) {
      throw error;
    }

    if (request._retry || isAuthEndpoint(request.url)) {
      throw error;
    }

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
      window.dispatchEvent(new Event("auth:expired"));
      throw refreshError;
    }

    return http(request);
  },
);
