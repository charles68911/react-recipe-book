import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Plus,
  RotateCw,
  Search,
  Soup,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import {
  deleteRecipeService,
  getRecipesService,
  type Recipe,
} from "@/services/recipe-service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/features/recipe/recipe-card";
import AddRecipeForm from "@/components/features/recipe/add-recipe-form";
import { Navigate } from "react-router";

// Same surface as the login card so every page feels like one app
const surface =
  "rounded-[30px] border border-white/20 bg-white/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,.22)]";

// Same green as the "Continue" button on the login page
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300";

const difficultyFilters = ["All", "Easy", "Medium", "Hard"] as const;
type DifficultyFilter = (typeof difficultyFilters)[number];

export function RecipeCollection() {
  const { user, ready } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Bump this number to load the recipes again (used by the Try again button)
  const [reloadKey, setReloadKey] = useState(0);

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");

  useEffect(() => {
    if (!ready || !user) return;

    let active = true;

    async function loadRecipes() {
      setLoading(true);

      try {
        const result = await getRecipesService();

        if (active) {
          setRecipes(result);
          setError("");
        }
      } catch {
        if (active) {
          setError(
            "Couldn't load your recipes. Check your connection and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      active = false;
    };
  }, [ready, user, reloadKey]);

  // Search by name, cuisine, meal type or tag, then filter by difficulty
  const visibleRecipes = useMemo(() => {
    const term = query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      if (difficulty !== "All" && recipe.difficulty !== difficulty) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        recipe.name,
        recipe.cuisine,
        ...(recipe.mealType ?? []),
        ...(recipe.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [recipes, query, difficulty]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe?")) return;

    try {
      await deleteRecipeService(id);

      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    } catch {
      setError("Couldn't delete the recipe. Please try again.");
    }
  }

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleCreated(recipe: Recipe) {
    setRecipes((current) => [recipe, ...current]);
    closeForm();
  }

  function clearFilters() {
    setQuery("");
    setDifficulty("All");
  }

  // Change this if "ready to cook" should mean something specific,
  // for example recipes that already have ingredients and steps.
  const readyToCook = recipes.length;

  const hasRecipes = !loading && recipes.length > 0;
  const showEmpty = !loading && !error && recipes.length === 0;
  const noMatches = hasRecipes && visibleRecipes.length === 0;
  const isFiltering = query.trim() !== "" || difficulty !== "All";

  return (
    <>
      {/* Header + stats */}
      <section className={`relative mb-8 overflow-hidden p-8 ${surface}`}>

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Recipes</h2>
            <p className="mt-1 text-slate-500">
              Everything you've saved, ready when you are.
            </p>
          </div>

          <Button onClick={openForm} className={primaryButton}>
            <Plus size={18} strokeWidth={2.4} />
            Add Recipe
          </Button>
        </div>

        {/* Stats: one color per icon, a different color per box */}
        <div className="relative mt-7 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpen size={24} aria-hidden />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Recipes</p>
              <p className="text-3xl font-bold text-slate-900">
                {recipes.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <UtensilsCrossed size={24} aria-hidden />
            </div>

            <div>
              <p className="text-sm text-slate-500">Ready to Cook</p>
              <p className="text-3xl font-bold text-slate-900">
                {readyToCook}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error: says what happened and offers a way out */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden />
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:self-auto"
          >
            <RotateCw size={16} aria-hidden />
            Try again
          </button>
        </div>
      )}

      {/* Search + difficulty filter, styled like the login inputs */}
      {hasRecipes && (
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search recipes</span>
            <Search
              size={20}
              aria-hidden
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, cuisine or tag"
              className="h-14 w-full rounded-2xl border border-white bg-white pl-12 pr-4 text-slate-900 shadow-lg shadow-black/10 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <div
            role="group"
            aria-label="Filter by difficulty"
            className="flex gap-2 overflow-x-auto"
          >
            {difficultyFilters.map((level) => {
              const selected = difficulty === level;

              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDifficulty(level)}
                  className={
                    selected
                      ? "h-14 shrink-0 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 font-semibold text-white shadow-lg shadow-emerald-950/30 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                      : "h-14 shrink-0 rounded-2xl bg-white px-5 font-medium text-slate-600 shadow-lg shadow-black/10 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  }
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Result count, only while filtering */}
      {hasRecipes && isFiltering && !noMatches && (
        <p className="mb-4 text-sm text-emerald-100/90" aria-live="polite">
          Showing {visibleRecipes.length} of {recipes.length} recipes
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-24 text-center" role="status">
          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-emerald-300 border-t-transparent" />
          <p className="font-medium text-emerald-100/90">
            Loading your recipes...
          </p>
        </div>
      )}

      {/* Empty (only when there was no error) */}
      {showEmpty && (
        <div
          className={`border-dashed border-emerald-200 p-16 text-center ${surface}`}
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Soup size={42} aria-hidden />
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            No Recipes Yet
          </h3>

          <p className="mx-auto mt-3 max-w-md text-slate-500">
            Start building your digital cookbook by adding your first delicious
            recipe.
          </p>

          <Button onClick={openForm} className={`mt-8 ${primaryButton}`}>
            <Plus size={18} strokeWidth={2.4} />
            Add Your First Recipe
          </Button>
        </div>
      )}

      {/* Nothing matched the search or filter */}
      {noMatches && (
        <div className={`p-14 text-center ${surface}`}>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Search size={34} aria-hidden />
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            No matching recipes
          </h3>

          <p className="mx-auto mt-2 max-w-md text-slate-500">
            Try a different word, or clear the filters to see everything.
          </p>

          <Button onClick={clearFilters} className={`mt-6 ${primaryButton}`}>
            Clear filters
          </Button>
        </div>
      )}

      {/* List */}
      {hasRecipes && !noMatches && (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal open={open} onClose={closeForm} title="Add Recipe">
        <AddRecipeForm onSuccess={handleCreated} />
      </Modal>
    </>
  );
}