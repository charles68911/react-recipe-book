import { useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// i comment this part to make it responsive even there's no backend
// import { useAuth } from "@/components/context/use-auth";
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

  return "Could not connect to the API. Check that the API server is running.";
}

export function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   setError("");
  //   setBusy(true);

  //   try {
  //     const currentUser = await login(email, password);

  //     navigate(currentUser.role === "ADMIN" ? "/admin" : "/user", {
  //       replace: true,
  //     });
  //   } catch (requestError) {
  //     setError(getErrorMessage(requestError));
  //   } finally {
  //     setBusy(false);
  //   }
  // }

function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setBusy(true);

  // Temporary demo login without a backend
  const isAdmin =
    email.trim().toLowerCase() === "admin@example.com";

  const demoUser = {
    id: isAdmin ? "demo-admin" : "demo-user",
    name: isAdmin ? "Demo Admin" : "Demo User",
    email: email.trim(),
    role: isAdmin ? "ADMIN" : "USER",
  };

  sessionStorage.setItem("demoUser", JSON.stringify(demoUser));

  navigate(isAdmin ? "/admin" : "/user", { replace: true });

  setBusy(false);
}

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* EMAIL */}

      <div>
        <Label
          htmlFor="auth-email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </Label>

        <div className="relative">
<Mail
size={18}
strokeWidth={2}
className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
/>

          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            className="pl-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* PASSWORD */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label
            htmlFor="auth-password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </Label>

          <button
            type="button"
            className="text-sm text-emerald-700 hover:text-emerald-900"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
<Lock
  size={18}
  strokeWidth={2}
  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
/>

          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={1}
            placeholder="Enter your password"
            className="pl-11 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    text-slate-400
    transition-colors
    hover:text-slate-700
  "
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
        </div>
      </div>

{error && (
  <p
    role="alert"
    className="
      rounded-xl
      border
      border-red-200
      bg-red-50
      px-4
      py-3
      text-sm
      text-red-600
    "
  >
    {error}
  </p>
)}

<Button
type="submit"
disabled={busy}
className="
w-full
h-12
font-semibold
shadow-lg
transition-all
duration-300
hover:-translate-y-0.5
hover:shadow-xl
"
>
        {busy ? "Signing in..." : "Continue"}
      </Button>
    </form>
  );
}