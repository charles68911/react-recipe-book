import { http } from "@/lib/axios";

export type Recipe = {
  id: string;
  image: string;
  name: string;
  cuisine: string;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  tags: string[];
  instructions: string[];
  ingredients: string[];
};

// Type for Recipe Input but without id
export type AdminRecipe = Recipe & {
  userId: string;
  ownerName: string | null;
};

export type RecipeInput = Omit<Recipe, "id">;

// Update Recipe but partial update meaning we can update only some fields not all fields
export type RecipeUpdate = Partial<RecipeInput>;

// Get Recipes Service
export async function getRecipesService() {
  const response = await http.get("/recipes/v1/get-recipes");
  return response.data.data.recipes as Recipe[];
}

// Get Recipe Service
export async function getRecipeService(id: string) {
  const response = await http.get(`/recipes/v1/get-recipe/${id}`);
  return response.data.data.recipe as Recipe;
}

// Create Recipe Service
export async function createRecipeService(recipe: RecipeInput) {
  const response = await http.post("/recipes/v1/create-recipe", recipe);
  return response.data.data.recipe as Recipe;
}

// Update Recipe Service
export async function updateRecipeService(id: string, recipe: RecipeUpdate) {
  const response = await http.post(`/recipes/v1/update-recipe/${id}`, recipe);
  return response.data.data.recipe as Recipe;
}

// Delete Recipe Service
export async function deleteRecipeService(id: string) {
  await http.post(`/recipes/v1/delete-recipe/${id}`, {});
}

// Get All Recipes Service (Admin)
export async function getAllRecipesService() {
  const response = await http.get("/recipes/v1/get-all-recipes");
  return response.data.data.recipes as AdminRecipe[];
}