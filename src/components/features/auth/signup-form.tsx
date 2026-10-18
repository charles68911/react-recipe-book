import { useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
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

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const currentUser = await signup(name, email, password);
      const destination = currentUser.role === "ADMIN" ? "/admin" : "/user";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* NAME */}
      <div>
        <Label
          htmlFor="auth-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Name
        </Label>
        <div className="relative">
          <User
            size={18}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="auth-name"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Enter your name"
            className="pl-11"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </div>

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
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <Label
          htmlFor="auth-password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </Label>
        <div className="relative">
          <Lock
            size={18}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Create a password"
            className="pl-11 pr-12"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Use at least 8 characters, including one uppercase letter and one number.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={busy}
        className="w-full h-12 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        {busy ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
