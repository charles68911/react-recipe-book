import { useEffect, useState } from "react";


import { getRecipeService, type Recipe } from "@/services/recipe-service";

import RecipeMeta from "@/components/common/recipe-meta";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import UpdateRecipeForm from "@/components/features/recipe/update-recipe-form";

export function RecipeDetails({ id }: { id: string }) {


  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    let active = true;
    async function loadRecipe(recipeId: string) {
      try {
        const result = await getRecipeService(recipeId);
        if (active) {
          setRecipe(result);
        }
      } catch {
        if (active) {
          setError("Recipe not found, or you do not have access to it.");
        }
      }
    }

    loadRecipe(id);

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [id]);

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipe(updatedRecipe);
    closeForm();
  }

  // Keep recipe content and its update dialog together in this feature.
  return (
    <>
      {error ? <p role="alert" className="mt-6 text-sm text-red-200">{error}</p> : recipe && <>
        {/* Keep image, metadata, and cooking steps grouped in one detail card. */}
        <Card className="mt-6 overflow-hidden">
          <div className="relative bg-emerald-100">
            <img className="h-64 w-full object-cover sm:h-[420px]" src={recipe.image} alt={recipe.name} />
            <span className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold",
              recipe.difficulty === "Easy" && "bg-emerald-50 text-emerald-700",
              recipe.difficulty === "Medium" && "bg-amber-50 text-amber-700",
              recipe.difficulty === "Hard" && "bg-rose-50 text-rose-700"
            )}>{recipe.difficulty}</span>
          </div>
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{recipe.cuisine}</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{recipe.name}</h1>
              </div>
              <Button onClick={openForm}>Update</Button>
            </div>

            <div className="mt-8 border-y border-emerald-900/10 py-6">
              <RecipeMeta cuisine={recipe.cuisine} mealType={recipe.mealType} difficulty={recipe.difficulty} cookTimeMinutes={recipe.cookTimeMinutes} />
            </div>

            {recipe.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{recipe.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>}

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="border-t border-emerald-900/10 pt-6">
                <h2 className="mb-4 text-base font-semibold tracking-tight">Ingredients</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-emerald-950/75">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul>
              </div>
              <div className="border-t border-emerald-900/10 pt-6">
                <h2 className="mb-4 text-base font-semibold tracking-tight">Instructions</h2>
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-emerald-950/75">{recipe.instructions.map((instruction, index) => <li key={`${instruction}-${index}`}>{instruction}</li>)}</ol>
              </div>
            </div>
          </div>
        </Card>
        {/* The modal reuses the recipe form and updates this page after saving. */}
        <Modal open={open} onClose={closeForm} title="Update Recipe">
          <UpdateRecipeForm recipe={recipe} onSuccess={handleUpdated} />
        </Modal>
      </>}
    </>
  );
}
