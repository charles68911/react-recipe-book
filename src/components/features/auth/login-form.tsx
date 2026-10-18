import { useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Keep field values in React state; the auth context calls the API service.
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const currentUser = await login(email, password);
      // Navigate after the context has received the authenticated user.
      const destination = currentUser.role === "ADMIN" ? "/admin" : "/user";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-7">
      {/* EMAIL */}

      <div className="space-y-2">
        <Label
          htmlFor="auth-email"
          className="text-sm font-semibold tracking-wide text-slate-700"
        >
          Email Address
        </Label>

        <div className="group relative">
          <Mail
            size={18}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
          />

          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 pl-11"
          />
        </div>
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">
        <Label
          htmlFor="auth-password"
          className="text-sm font-semibold tracking-wide text-slate-700"
        >
          Password
        </Label>

        <div className="group relative">
          <Lock
            size={18}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
          />

          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            minLength={1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 pl-11 pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-700"
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden />
            ) : (
              <Eye size={18} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {error}
        </div>
      )}

      {/* BUTTON */}

      <Button
        type="submit"
        disabled={busy}
        className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold tracking-wide shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-2xl active:scale-[0.98]"
      >
        {busy ? "Signing in..." : "Continue"}
      </Button>
    </form>
  );
}