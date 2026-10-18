import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CookingPot,
  RotateCw,
  Search,
  Star,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getAllRecipesService } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AdminRecipesTable, type AdminRecipe } from "./admin-recipes-table";

const difficultyFilters = ["All", "Easy", "Medium", "Hard"] as const;
type DifficultyFilter = (typeof difficultyFilters)[number];

// Same glass surface as the login card and the recipe collection header.
const surface =
  "rounded-[30px] border border-white/20 bg-white/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,.22)]";

type Tile = {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  box: string;
  chip: string;
};

// This feature owns the recipe request, the filters, and the request state.
export function AdminRecipes() {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");

  useEffect(function fetchRecipes() {
    let active = true;

    async function loadAllRecipes() {
      setLoading(true);
      setError("");

      try {
        const rows = await getAllRecipesService();
        if (active) {
          setRecipes(rows);
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

    loadAllRecipes();

    // Ignore late responses after leaving the page or starting a new request.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [reload]);

  function handleRefresh() {
    // Changing this value runs the fetching effect again.
    setReload(function incrementReload(currentReload) {
      return currentReload + 1;
    });
  }

  // One entry per cook, so the filter lists people rather than rows.
  const owners = useMemo(() => {
    const names = new Map<string, string>();

    for (const recipe of recipes) {
      names.set(recipe.userId, recipe.ownerName ?? "Unnamed cook");
    }

    return [...names.entries()].sort(function byName(a, b) {
      return a[1].localeCompare(b[1]);
    });
  }, [recipes]);

  // Library totals shown above the table.
  const stats = useMemo(() => {
    const cooks = new Set(recipes.map((recipe) => recipe.userId)).size;

    const average = recipes.length
      ? Math.round(
          recipes.reduce((total, recipe) => total + recipe.cookTimeMinutes, 0) /
            recipes.length
        )
      : 0;

    const cuisineCounts = new Map<string, number>();
    for (const recipe of recipes) {
      cuisineCounts.set(recipe.cuisine, (cuisineCounts.get(recipe.cuisine) ?? 0) + 1);
    }

    const topCuisine = [...cuisineCounts.entries()].sort(function byCount(a, b) {
      return b[1] - a[1];
    })[0];

    return { total: recipes.length, cooks, average, topCuisine };
  }, [recipes]);

  const tiles: Tile[] = [
    {
      icon: CookingPot,
      label: "Recipes in library",
      value: String(stats.total),
      caption: loading ? "Syncing…" : "across every account",
      box: "bg-emerald-50",
      chip: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: Users,
      label: "Home cooks",
      value: String(stats.cooks),
      caption: "contributing recipes",
      box: "bg-amber-50",
      chip: "bg-amber-100 text-amber-700",
    },
    {
      icon: Timer,
      label: "Average cook time",
      value: stats.average ? `${stats.average} min` : "—",
      caption: "per recipe",
      box: "bg-sky-50",
      chip: "bg-sky-100 text-sky-700",
    },
    {
      icon: Star,
      label: "Top cuisine",
      value: stats.topCuisine?.[0] ?? "—",
      caption: "most saved",
      box: "bg-rose-50",
      chip: "bg-rose-100 text-rose-700",
    },
  ];

  // Search names, cuisines and cook names, then narrow by cook and level.
  const visibleRecipes = useMemo(() => {
    const term = query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      if (owner !== "all" && recipe.userId !== owner) return false;
      if (difficulty !== "All" && recipe.difficulty !== difficulty) return false;
      if (!term) return true;

      const haystack = [
        recipe.name,
        recipe.cuisine,
        recipe.ownerName ?? "",
        ...recipe.mealType,
        ...recipe.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [recipes, query, owner, difficulty]);

  const hasRows = !loading && recipes.length > 0;
  const isFiltering =
    query.trim() !== "" || owner !== "all" || difficulty !== "All";

  function clearFilters() {
    setQuery("");
    setOwner("all");
    setDifficulty("All");
  }

  return (
    <section aria-label="All recipes">
      {/* Library totals */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(function renderTile(tile) {
          const Icon = tile.icon;

          return (
            <div
              key={tile.label}
              className={`flex items-center gap-4 rounded-2xl p-5 ${tile.box}`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tile.chip}`}
              >
                <Icon size={24} aria-hidden />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm text-slate-500">{tile.label}</p>
                <p className="truncate text-3xl font-bold text-slate-900">{tile.value}</p>
                <p className="truncate text-xs text-slate-400">{tile.caption}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search, cook and level filters, plus refresh */}
      <div className={`mb-6 p-5 ${surface}`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <label htmlFor="admin-search" className="sr-only">
              Search recipes
            </label>
            <Search
              size={20}
              aria-hidden
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="admin-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a recipe, cuisine, tag or cook"
              className="h-14 border-white pl-12 shadow-lg shadow-black/10 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="xl:w-64">
            <label htmlFor="admin-owner" className="sr-only">
              Filter by cook
            </label>
            <Select
              id="admin-owner"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className="h-14 border-white bg-white shadow-lg shadow-black/10"
            >
              <option value="all">Every cook</option>
              {owners.map(([userId, name]) => (
                <option key={userId} value={userId}>
                  {name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="secondary"
            disabled={loading}
            onClick={handleRefresh}
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 border-transparent bg-white px-5 font-semibold text-slate-600 shadow-lg shadow-black/10 hover:text-emerald-700"
          >
            <RotateCw size={18} aria-hidden className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        <div
          role="group"
          aria-label="Filter by difficulty"
          className="mt-3 flex gap-2 overflow-x-auto"
        >
          {difficultyFilters.map((level) => {
            const selected = difficulty === level;

            return (
              <Button
                key={level}
                variant={selected ? "primary" : "secondary"}
                aria-pressed={selected}
                onClick={() => setDifficulty(level)}
                className={
                  selected
                    ? "inline-flex h-12 shrink-0 items-center justify-center gap-2 border-transparent bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 font-semibold text-white focus-visible:outline-emerald-300"
                    : "inline-flex h-12 shrink-0 items-center justify-center gap-2 border-transparent bg-white px-5 font-medium text-slate-600 hover:text-emerald-700 focus-visible:outline-emerald-300"
                }
              >
                {level}
              </Button>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} aria-hidden className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>

          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="inline-flex self-start items-center justify-center gap-2 rounded-xl border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-red-600 sm:self-auto"
          >
            <RotateCw size={16} aria-hidden />
            Try again
          </Button>
        </div>
      )}

      {hasRows && isFiltering && (
        <p aria-live="polite" className="mb-4 text-sm text-emerald-100/90">
          Showing {visibleRecipes.length} of {recipes.length} recipes
          {owner !== "all" &&
            ` · ${owners.find(([id]) => id === owner)?.[1] ?? "cook"}`}
        </p>
      )}

      {loading && (
        <div className="py-24 text-center" role="status">
          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-emerald-300 border-t-transparent" />
          <p className="font-medium text-emerald-100/90">Loading the library...</p>
        </div>
      )}

      {isFiltering && visibleRecipes.length === 0 && !loading && !error && (
        <div className={`p-14 text-center ${surface}`}>
          <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Search size={34} aria-hidden />
          </span>

          <h3 className="text-2xl font-bold text-slate-900">No matching recipes</h3>

          <p className="mx-auto mt-2 max-w-md text-slate-500">
            Nothing in the library fits those filters yet.
          </p>

          <Button
            onClick={clearFilters}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800"
          >
            Clear filters
          </Button>
        </div>
      )}

      {!isFiltering && !loading && !error && <AdminRecipesTable recipes={visibleRecipes} loading={loading} />}
    </section>
  );
}