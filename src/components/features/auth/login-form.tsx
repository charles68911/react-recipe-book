import { useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return "Could not connect to the API.";
}

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setBusy(true);

    const isAdmin =
      email.trim().toLowerCase() === "admin@example.com";

    const demoUser = {
      id: isAdmin ? "demo-admin" : "demo-user",
      name: isAdmin ? "Demo Admin" : "Demo User",
      email: email.trim(),
      role: isAdmin ? "ADMIN" : "USER",
    };

    sessionStorage.setItem("demoUser", JSON.stringify(demoUser));

    navigate(isAdmin ? "/admin" : "/user", {
      replace: true,
    });

    setBusy(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-7"
    >
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
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition-colors
              group-focus-within:text-emerald-600
            "
          />

          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              pl-11
              h-14
              rounded-2xl
              transition-all
            "
          />
        </div>
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="auth-password"
            className="text-sm font-semibold tracking-wide text-slate-700"
          >
            Password
          </Label>

          <button
            type="button"
            className="
              text-sm
              font-medium
              text-emerald-700
              transition-colors
              hover:text-emerald-900
            "
          >
            Forgot Password?
          </button>
        </div>

        <div className="group relative">
          <Lock
            size={18}
            strokeWidth={2}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition-colors
              group-focus-within:text-emerald-600
            "
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
            className="
              pl-11
              pr-12
              h-14
              rounded-2xl
              transition-all
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              rounded-full
              p-1
              text-slate-400
              transition-all
              hover:bg-slate-100
              hover:text-emerald-700
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* BUTTON */}

      <Button
        type="submit"
        disabled={busy}
        className="
          h-14
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-emerald-600
          to-emerald-700
          text-white
          font-semibold
          tracking-wide
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-2xl
          hover:from-emerald-700
          hover:to-emerald-800
          active:scale-[0.98]
        "
      >
        {busy ? "Signing in..." : "Continue"}
      </Button> 
    </form>
  );
}