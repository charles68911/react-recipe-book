type AuthFormHeaderProps = {
  title: string;
  description: string;
};

export function AuthFormHeader({
  title,
  description,
}: AuthFormHeaderProps) {
  return (
    <header className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </header>
  );
}