import { Recipe } from "../api/recipes"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Clock, Users, ChefHat, Heart, Share2 } from "lucide-react"

interface RecipeHeaderProps {
  recipe: Recipe
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSaveRecipe = () => {
    console.log("Saving recipe:", recipe.name)
    // This would save the recipe to user's favorites
  }

  const handleShareRecipe = () => {
    console.log("Sharing recipe:", recipe.name)
    // This would open share dialog
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              <ChefHat className="h-3 w-3 mr-1" />
              {recipe.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {recipe.cuisine}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.name}</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-foreground">
                {recipe.prepTime + recipe.cookingTime} min total
              </div>
              <div className="text-xs">
                {recipe.prepTime}min prep • {recipe.cookingTime}min cook
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-foreground">
                {recipe.servings} servings
              </div>
              <div className="text-xs">Serves {recipe.servings}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveRecipe}
            className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-red-50 hover:text-red-600"
          >
            <Heart className="h-4 w-4 mr-2" />
            Save Recipe
          </Button>
          <Button
            variant="outline"
            onClick={handleShareRecipe}
            className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-blue-50 hover:text-blue-600"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
      </div>
    </div>
  )
}