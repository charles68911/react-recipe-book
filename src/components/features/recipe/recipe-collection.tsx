import { useEffect, useState } from "react";
import { Plus, Utensils } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { deleteRecipeService, getRecipesService, type Recipe } from "@/services/recipe-service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/features/recipe/recipe-card";
import AddRecipeForm from "@/components/features/recipe/add-recipe-form";
import { Navigate } from "react-router";

export function RecipeCollection() {
  const { user, ready } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function fetchRecipes() {
    if (!ready || !user) {
      return;
    }

    let active = true;

    async function loadRecipes() {
      try {
        const result = await getRecipesService();
        if (active) {
          setRecipes(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Unable to load recipes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    // Ignore a response if the account changes or this feature is removed.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [ready, user]);
  async function handleDelete(id: string) {
    if (!confirm("Do you want to delete this recipe?")) return;
    try {
      await deleteRecipeService(id);
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    } catch {
      setError("Unable to delete this recipe. Please try again.");
    }
  };

  if (!ready) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleCreated(newRecipe: Recipe) {
    setRecipes(function addRecipe(currentRecipes) {
      return [newRecipe, ...currentRecipes];
    });
    closeForm();
  }

  // The page supplies the header; this feature owns the collection and its dialog.
  return (
    <><>
        {/* Collection heading and primary action wrap on narrow screens. */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="text-2xl font-semibold tracking-tight text-amber-50">Your recipes</h2><p className="mt-1 text-sm text-emerald-100/70">{recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"} to inspire your next meal</p></div>
          <Button onClick={openForm} className="inline-flex items-center gap-1.5 rounded-full"><Plus size={16} /> Add Recipe</Button>
        </div>
        {error && <p role="alert" className="mb-4 text-sm text-red-200">{error}</p>}
        {loading && !error ? (
          <p className="py-16 text-center text-sm text-emerald-100/70">Loading your recipes…</p>
        ) : recipes.length === 0 ? <div className="rounded-[30px] border border-white/20 bg-white/85 px-6 py-16 text-center backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,.18)]"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Utensils size={22} /></span><h3 className="mt-4 text-xl font-semibold text-emerald-950">A fresh page for your favorites</h3><p className="mt-2 text-sm text-emerald-950/65">Save a family classic or something new you want to try.</p><Button className="mt-6 rounded-full" onClick={openForm}>Add your first recipe</Button></div> :
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} onDelete={handleDelete} />)}
          </div>}
        {/* Add the saved recipe to local state so the list updates immediately. */}
        <Modal open={open} onClose={closeForm} title="Add Recipe">
          <AddRecipeForm onSuccess={handleCreated} />
        </Modal>
      </>
    </>
  );
}
