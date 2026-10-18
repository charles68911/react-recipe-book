import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { RecipeDetails } from "@/components/features/recipe/recipe-details";

export default function RecipePage() {
  const { id } = useParams();

  // The page reads the URL; the feature fetches and displays that recipe.
  return (
    <Section>
      <Link to="/user" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-amber-50">
        <ArrowLeft size={15} />
        Back to recipes
      </Link>

      {id && <RecipeDetails key={id} id={id} />}
    </Section>
  );
}
