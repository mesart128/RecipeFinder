import { Recipe } from "../api/recipes"
import { RecipeCard } from "./RecipeCard"

interface RecipeGridProps {
  recipes: Recipe[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  )
}