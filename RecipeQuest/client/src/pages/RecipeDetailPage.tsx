import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRecipeById, Recipe } from "../api/recipes"
import { useToast } from "../hooks/useToast"
import { RecipeHeader } from "../components/RecipeHeader"
import { RecipeIngredients } from "../components/RecipeIngredients"
import { RecipeInstructions } from "../components/RecipeInstructions"
import { IngredientFinder } from "../components/IngredientFinder"
import { Button } from "../components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [showIngredientFinder, setShowIngredientFinder] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchRecipe(id)
    }
  }, [id])

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true)
      console.log("Fetching recipe details for ID:", recipeId)
      const response = await getRecipeById(recipeId) as { recipe: Recipe }
      setRecipe(response.recipe)
    } catch (error) {
      console.error("Error fetching recipe:", error)
      toast({
        title: "Error",
        description: "Failed to load recipe details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-lg">Loading recipe details...</span>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Recipe not found</h1>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button 
        onClick={() => navigate("/")} 
        variant="ghost" 
        className="mb-4 hover:bg-orange-50 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Recipes
      </Button>

      <RecipeHeader recipe={recipe} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RecipeIngredients 
            ingredients={recipe.ingredients}
            onFindIngredients={() => setShowIngredientFinder(true)}
          />
        </div>
        
        <div className="lg:col-span-2">
          <RecipeInstructions instructions={recipe.instructions} />
        </div>
      </div>

      {showIngredientFinder && (
        <IngredientFinder
          ingredients={recipe.ingredients}
          onClose={() => setShowIngredientFinder(false)}
        />
      )}
    </div>
  )
}