type RecipeMetaProps = {
  cuisine: string;
  mealType: string[];
  difficulty: string;
  cookTimeMinutes: number;
};

export default function RecipeMeta({ cuisine, mealType, difficulty, cookTimeMinutes }: RecipeMetaProps) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <div><dt className="text-xs text-emerald-950/55">Cuisine</dt><dd className="mt-1 font-medium text-emerald-950">{cuisine}</dd></div>
      <div><dt className="text-xs text-emerald-950/55">Meal type</dt><dd className="mt-1 font-medium text-emerald-950">{mealType.join(", ")}</dd></div>
      <div><dt className="text-xs text-emerald-950/55">Difficulty</dt><dd className="mt-1 font-medium text-emerald-950">{difficulty}</dd></div>
      <div><dt className="text-xs text-emerald-950/55">Cook time</dt><dd className="mt-1 font-medium text-emerald-950">{cookTimeMinutes} mins</dd></div>
    </dl>
  );
}
