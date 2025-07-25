import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { RecipeGrid } from "../components/RecipeGrid"
import { RecipeFilters } from "../components/RecipeFilters"
import { getRecipes, Recipe } from "../api/recipes"
import { useToast } from "../hooks/useToast"
import { Loader2 } from "lucide-react"

export function HomePage() {
  const [searchParams] = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: '',
    difficulty: '',
    maxTime: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchRecipes()
  }, [filters])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      console.log("Fetching recipes with filters:", filters)
      const response = await getRecipes(filters) as { recipes: Recipe[] }
      setRecipes(response.recipes)
    } catch (error) {
      console.error("Error fetching recipes:", error)
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: typeof filters) => {
    console.log("Filters changed:", newFilters)
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-lg">Loading delicious recipes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Discover Amazing Recipes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect recipe for any occasion. From quick weeknight dinners to special celebration meals.
        </p>
      </div>

      <RecipeFilters 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
      />

      <RecipeGrid recipes={recipes} />
    </div>
  )
}