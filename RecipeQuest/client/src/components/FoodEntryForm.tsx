import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { FoodEntry, addFoodEntry, updateFoodEntry } from "../api/foodDiary"
import { useToast } from "../hooks/useToast"
import { Utensils, Loader2, Plus } from "lucide-react"

interface FoodEntryFormProps {
  date: string
  entry?: FoodEntry
  onClose: () => void
  onSave: () => void
}

export function FoodEntryForm({ date, entry, onClose, onSave }: FoodEntryFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    date: entry?.date || date,
    mealType: entry?.mealType || 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    foodName: entry?.foodName || '',
    quantity: entry?.quantity || 1,
    unit: entry?.unit || 'serving',
    calories: entry?.calories || 0,
    protein: entry?.protein || 0,
    carbs: entry?.carbs || 0,
    fat: entry?.fat || 0,
    notes: entry?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.foodName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a food name.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      if (entry) {
        await updateFoodEntry(entry._id, formData)
        toast({
          title: "Success",
          description: "Food entry updated successfully.",
        })
      } else {
        await addFoodEntry(formData)
        toast({
          title: "Success",
          description: "Food entry added successfully.",
        })
      }
      
      onSave()
      onClose()
    } catch (error) {
      console.error("Error saving food entry:", error)
      toast({
        title: "Error",
        description: "Failed to save food entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-orange-500" />
            {entry ? 'Edit Food Entry' : 'Add Food Entry'}
          </DialogTitle>
          <DialogDescription>
            {entry ? 'Update your food entry details below.' : 'Add a new food entry to your diary.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select
                value={formData.mealType}
                onValueChange={(value: 'breakfast' | 'lunch' | 'dinner' | 'snack') =>
                  setFormData({ ...formData, mealType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={formData.foodName}
              onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
              placeholder="e.g., Grilled chicken breast"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serving">Serving</SelectItem>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="slice">Slice</SelectItem>
                  <SelectItem value="bowl">Bowl</SelectItem>
                  <SelectItem value="plate">Plate</SelectItem>
                  <SelectItem value="gram">Gram</SelectItem>
                  <SelectItem value="ounce">Ounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {entry ? 'Update' : 'Add'} Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}