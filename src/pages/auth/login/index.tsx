import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
<Card
  className="
  mx-auto
  w-full
  max-w-md
  rounded-[30px]
  bg-white/90
  border border-white/20
  backdrop-blur-xl
  p-10
  shadow-[0_30px_80px_rgba(0,0,0,.22)]
"
>
      <AuthFormHeader
        title="Welcome Back"
        description="Sign in to continue managing your favorite recipes."
      />

      <LoginForm />

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Create one
        </Link>
      </p>
    </Card>
  );
}