import { Link, useParams } from "react-router";
import { Section } from "@/components/ui/section";
import { RecipeDetails } from "@/components/features/recipe/recipe-details";

export default function RecipePage() {
  const { id } = useParams();

  // The page reads the URL; the feature fetches and displays that recipe.
  return (
    <Section>
      <Link to="/user" className="text-sm font-medium text-emerald-800 hover:text-emerald-950">
        ← Back to recipes
      </Link>

      {id && <RecipeDetails key={id} id={id} />}
    </Section>
  );
}
