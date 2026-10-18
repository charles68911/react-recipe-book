import { Fragment, useState } from "react";
import { ChevronRight, Clock, CookingPot } from "lucide-react";
import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import type { AdminRecipe } from "@/services/recipe-service";

export type { AdminRecipe } from "@/services/recipe-service";

type AdminRecipesTableProps = {
  recipes: AdminRecipe[];
  loading: boolean;
};

// One dot colour per level, matching the difficulty chip on the recipe card.
// The record type restricts difficulty, so this lookup always has a colour.
const difficultyTone = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
} as const;

// Reads like a printed cookbook index: numbered lines, a photo, and the cook.
function ownerInitials(name: string | null, userId: string) {
  const source = name?.trim();

  if (!source) return userId.slice(0, 2).toUpperCase();

  const words = source.split(/\s+/);
  return words.length > 1
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : source.slice(0, 2).toUpperCase();
}

type RecipeRowProps = {
  recipe: AdminRecipe;
  index: number;
  expanded: boolean;
  onToggle: () => void;
};

function AdminRecipeRow({ recipe, index, expanded, onToggle }: RecipeRowProps) {
  return (
    <Fragment>
      {/* Index line */}
      <tr className="group">
        <td className="align-middle font-mono text-xs text-emerald-900/35">
          {String(index + 1).padStart(2, "0")}
        </td>

        {/* The recipe name is the row header and the button that opens the detail. */}
        <th scope="row" className="text-left font-normal">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex w-full cursor-pointer items-center gap-4 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
          >
            <img
              src={recipe.image}
              alt=""
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-emerald-900/10"
            />

            <span className="min-w-0">
              <span className="block truncate font-semibold text-emerald-950">
                {recipe.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-emerald-950/55">
                {recipe.ingredients.length} ingredients ·{" "}
                {recipe.instructions.length} steps
              </span>
            </span>
          </button>
        </th>

        <td className="text-emerald-950/75">{recipe.cuisine}</td>
        <td className="text-emerald-950/75">{recipe.mealType.join(", ")}</td>

        <td>
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-emerald-950/80">
            <span
              aria-hidden
              className={cn("h-2 w-2 rounded-full", difficultyTone[recipe.difficulty])}
            />
            {recipe.difficulty}
          </span>
        </td>

        <td>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-emerald-950/75">
            <Clock size={14} aria-hidden className="text-emerald-900/40" />
            {recipe.cookTimeMinutes} min
          </span>
        </td>

        <td>
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800"
            >
              {ownerInitials(recipe.ownerName, recipe.userId)}
            </span>
            <span className="truncate text-sm text-emerald-950/80">
              {recipe.ownerName || "Unnamed cook"}
            </span>
          </span>
        </td>

        <td className="text-right">
          <ChevronRight
            aria-hidden
            size={18}
            className={cn(
              "inline text-emerald-900/35 transition-transform duration-200",
              expanded && "rotate-90"
            )}
          />
        </td>
      </tr>

      {/* Detail line expands in place, so no dialog is needed. */}
      {expanded && (
        <tr>
          <td colSpan={8} className="p-0">
            <div className="grid gap-8 border-y border-emerald-900/10 bg-emerald-50/60 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="h-44 w-full rounded-2xl object-cover ring-1 ring-emerald-900/10"
                />

                {recipe.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}

                <dl className="mt-5 space-y-1 text-xs">
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-emerald-950/40">Recipe ID</dt>
                    <dd className="truncate font-mono text-emerald-950/55">{recipe.id}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-emerald-950/40">Cook ID</dt>
                    <dd className="truncate font-mono text-emerald-950/55">{recipe.userId}</dd>
                  </div>
                </dl>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900/50">
                    Ingredients
                  </h3>
                  <ul className="space-y-1.5 text-sm leading-6 text-emerald-950/75">
                    {recipe.ingredients.map((ingredient, ingredientIndex) => (
                      <li key={`${ingredient}-${ingredientIndex}`}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900/50">
                    Instructions
                  </h3>
                  <ol className="list-decimal space-y-1.5 pl-4 text-sm leading-6 text-emerald-950/75">
                    {recipe.instructions.map((instruction, instructionIndex) => (
                      <li key={`${instruction}-${instructionIndex}`}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

// Display only: fetching, filtering, and errors belong to AdminRecipes.
export function AdminRecipesTable({ recipes, loading }: AdminRecipesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleRow(id: string) {
    setExpandedId(function toggle(currentId) {
      return currentId === id ? null : id;
    });
  }

  return (
    <Table className="[&_thead]:bg-transparent [&_thead]:text-[11px] [&_thead]:font-semibold [&_thead]:uppercase [&_thead]:tracking-[0.12em] [&_thead]:text-emerald-900/45 [&_tbody_tr:hover]:bg-emerald-50/50">
      <caption className="sr-only">Recipes from all users</caption>
      <thead>
        <tr>
          <th scope="col" className="w-14">
            <span className="sr-only">Number</span>
          </th>
          <th scope="col">Recipe</th>
          <th scope="col">Cuisine</th>
          <th scope="col">Meal type</th>
          <th scope="col">Difficulty</th>
          <th scope="col">Cook time</th>
          <th scope="col">Cook</th>
          <th scope="col" className="w-12">
            <span className="sr-only">Details</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {!loading && recipes.length === 0 && (
          <tr>
            <td colSpan={8} className="py-16 text-center">
              <CookingPot size={34} aria-hidden className="mx-auto mb-3 text-emerald-900/20" />
              <p className="font-semibold text-emerald-950">The library is empty</p>
              <p className="mt-1 text-sm text-emerald-950/55">
                Recipes created by users will appear here.
              </p>
            </td>
          </tr>
        )}

        {recipes.map(function renderRecipe(recipe, index) {
          return (
            <AdminRecipeRow
              key={recipe.id}
              recipe={recipe}
              index={index}
              expanded={expandedId === recipe.id}
              onToggle={function showDetail() {
                toggleRow(recipe.id);
              }}
            />
          );
        })}
      </tbody>
    </Table>
  );
}