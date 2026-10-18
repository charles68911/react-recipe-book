import { useState } from "react";
import { Link } from "react-router";
import { Clock, Eye, Soup, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

type RecipeCardProps = {
  id: string;
  image: string;
  name: string;
  cuisine: string;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  tags: string[];
  onDelete: (id: string) => void;
};

// Show a few tags and summarize the rest so cards stay the same height
const MAX_TAGS = 3;

export default function RecipeCard({
  id,
  image,
  name,
  cuisine,
  mealType,
  difficulty,
  cookTimeMinutes,
  tags,
  onDelete,
}: RecipeCardProps) {
  // If the photo is missing or fails to load, show a placeholder instead
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  const visibleTags = tags.slice(0, MAX_TAGS);
  const hiddenTagCount = tags.length - visibleTags.length;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/20 bg-white/90 shadow-[0_30px_80px_rgba(0,0,0,.22)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      {/* Photo */}
      <div className="relative h-56 overflow-hidden bg-emerald-50">
        {showImage ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Soup size={38} />
            </span>
          </div>
        )}

        {/* Soft shade so the chips stay readable on bright photos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent"
        />

        {/* Difficulty: one solid color per level */}
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg",
            difficulty === "Easy" && "bg-emerald-600",
            difficulty === "Medium" && "bg-amber-500",
            difficulty === "Hard" && "bg-red-500"
          )}
        >
          {difficulty}
        </span>

        {/* Cook time */}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Clock size={14} aria-hidden />
          {cookTimeMinutes} mins
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Title block */}
        <div>
          <p className="text-sm font-semibold text-emerald-700">{cuisine}</p>

          <h3 className="mt-0.5 line-clamp-2 text-2xl font-bold text-slate-900">
            {name}
          </h3>
        </div>

        {/* Meal types */}
        {mealType.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mealType.map((meal) => (
              <span
                key={meal}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              >
                {meal}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {visibleTags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}

            {hiddenTagCount > 0 && (
              <span className="text-xs font-medium text-slate-500">
                +{hiddenTagCount} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-3 border-t border-slate-200/80 pt-5">
          {/* A link styled as a button, since a button inside a link is invalid HTML */}
          <Link
            to={`/recipe/${id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Eye size={17} aria-hidden />
            View Recipe
          </Link>

          <Button
            onClick={() => onDelete(id)}
            aria-label={`Delete ${name}`}
            title="Delete recipe"
            className="flex shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <Trash2 size={18} aria-hidden />
          </Button>
        </div>
      </div>
    </Card>
  );
}