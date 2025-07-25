import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { FoodEntry, DailyNutrition, getFoodEntriesForDate, deleteFoodEntry } from "../api/foodDiary"
import { FoodEntryForm } from "./FoodEntryForm"
import { useToast } from "../hooks/useToast"
import { Utensils, Plus, Edit, Trash2, Coffee, Sun, Moon, Cookie, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface DailyFoodLogProps {
  selectedDate: Date
  onDataChange: () => void
}

export function DailyFoodLog({ selectedDate, onDataChange }: DailyFoodLogProps) {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<FoodEntry | undefined>()
  const { toast } = useToast()

  useEffect(() => {
    fetchDayData()
  }, [selectedDate])

  const fetchDayData = async () => {
    try {
      setLoading(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await getFoodEntriesForDate(dateStr) as { entries: FoodEntry[], nutrition: DailyNutrition }

      setEntries(response.entries)
      setNutrition(response.nutrition)
    } catch (error) {
      console.error("Error fetching day data:", error)
      toast({
        title: "Error",
        description: "Failed to load food entries.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteFoodEntry(entryId)
      toast({
        title: "Success",
        description: "Food entry deleted successfully.",
      })
      fetchDayData()
      onDataChange()
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete food entry.",
        variant: "destructive",
      })
    }
  }

  const handleFormSave = () => {
    fetchDayData()
    onDataChange()
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4 text-orange-500" />
      case 'lunch': return <Sun className="h-4 w-4 text-yellow-500" />
      case 'dinner': return <Moon className="h-4 w-4 text-blue-500" />
      case 'snack': return <Cookie className="h-4 w-4 text-purple-500" />
      default: return <Utensils className="h-4 w-4 text-gray-500" />
    }
  }

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800'
      case 'lunch': return 'bg-yellow-100 text-yellow-800'
      case 'dinner': return 'bg-blue-100 text-blue-800'
      case 'snack': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = []
    }
    acc[entry.mealType].push(entry)
    return acc
  }, {} as { [key: string]: FoodEntry[] })

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-500" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <Button
              onClick={() => {
                setEditingEntry(undefined)
                setShowForm(true)
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nutrition && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{nutrition.totalCalories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{nutrition.totalProtein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{nutrition.totalCarbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{nutrition.totalFat}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Food Entries by Meal */}
      {loading ? (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              <span>Loading food entries...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mealOrder.map((mealType) => {
            const mealEntries = groupedEntries[mealType] || []

            return (
              <Card key={mealType} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {getMealIcon(mealType)}
                    {mealType}
                    <Badge className={getMealColor(mealType)}>
                      {mealEntries.length} {mealEntries.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mealEntries.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No {mealType} entries yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mealEntries.map((entry) => (
                        <div
                          key={entry._id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{entry.foodName}</div>
                            <div className="text-sm text-muted-foreground">
                              {entry.quantity} {entry.unit} • {entry.calories} calories
                              {entry.protein && entry.carbs && entry.fat && (
                                <span> • P: {entry.protein}g C: {entry.carbs}g F: {entry.fat}g</span>
                              )}
                            </div>
                            {entry.notes && (
                              <div className="text-xs text-muted-foreground mt-1 italic">
                                {entry.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEntry(entry)
                                setShowForm(true)
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry._id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Food Entry Form Modal */}
      {showForm && (
        <FoodEntryForm
          date={format(selectedDate, 'yyyy-MM-dd')}
          entry={editingEntry}
          onClose={() => {
            setShowForm(false)
            setEditingEntry(undefined)
          }}
          onSave={handleFormSave}
        />
      )}
    </div>
  )
}