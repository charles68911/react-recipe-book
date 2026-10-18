import { Link } from "react-router";
import { Clock, Trash2 } from "lucide-react";
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

export default function RecipeCard({id, image, name, cuisine, mealType, difficulty, cookTimeMinutes, tags, onDelete}: RecipeCardProps) {
  return (
    <Card className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(16,46,40,.25)]">
      <div className="relative h-52 overflow-hidden bg-emerald-100">
        <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={cn(
          "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
          difficulty === "Easy" && "bg-emerald-50 text-emerald-700",
          difficulty === "Medium" && "bg-amber-50 text-amber-700",
          difficulty === "Hard" && "bg-rose-50 text-rose-700"
        )}>
          {difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{cuisine}</p>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-emerald-950">{name}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-emerald-950/60">
          <span>{mealType.join(" · ")}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {cookTimeMinutes} mins
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <Link to={`/recipe/${id}`} className="flex-1">
            <Button className="w-full">View</Button>
          </Link>
          <Button onClick={() => onDelete(id)} className="inline-flex items-center gap-1.5 border border-emerald-900/10 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700">
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
