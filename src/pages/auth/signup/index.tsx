import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/features/auth/signup-form";

export default function SignupPage() {
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
        title="Create Account"
        description="A little inspiration for your everyday cooking."
      />

      <SignupForm />

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
