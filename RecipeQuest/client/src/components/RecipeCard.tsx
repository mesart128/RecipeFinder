import { useNavigate } from "react-router-dom"
import { Recipe } from "../api/recipes"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Clock, Users, ChefHat } from "lucide-react"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 hover:bg-red-200'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            <ChefHat className="h-3 w-3 mr-1" />
            {recipe.difficulty}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Badge variant="secondary" className="text-xs">
          {recipe.cuisine}
        </Badge>
      </CardFooter>
    </Card>
  )
}