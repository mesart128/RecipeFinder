import { Ingredient } from "../api/recipes"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { ShoppingCart, MapPin } from "lucide-react"
import { useState } from "react"

interface RecipeIngredientsProps {
  ingredients: Ingredient[]
  onFindIngredients: () => void
}

export function RecipeIngredients({ ingredients, onFindIngredients }: RecipeIngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())

  const toggleIngredient = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId)
    } else {
      newChecked.add(ingredientId)
    }
    setCheckedIngredients(newChecked)
    console.log("Toggled ingredient:", ingredientId, "Checked:", !checkedIngredients.has(ingredientId))
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
          Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient._id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors"
            >
              <Checkbox
                id={ingredient._id}
                checked={checkedIngredients.has(ingredient._id)}
                onCheckedChange={() => toggleIngredient(ingredient._id)}
              />
              <label
                htmlFor={ingredient._id}
                className={`flex-1 text-sm cursor-pointer ${
                  checkedIngredients.has(ingredient._id)
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}
              >
                <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>{' '}
                {ingredient.name}
              </label>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={onFindIngredients}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Find Ingredients Nearby
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}