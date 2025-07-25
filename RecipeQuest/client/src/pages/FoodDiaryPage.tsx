import { useState } from "react"
import { FoodDiaryCalendar } from "../components/FoodDiaryCalendar"
import { DailyFoodLog } from "../components/DailyFoodLog"

export function FoodDiaryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  const handleDataChange = () => {
    setRefreshTrigger(!refreshTrigger)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Food Diary
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your daily food intake, monitor nutrition, and maintain a healthy eating habit.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <FoodDiaryCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onRefresh={refreshTrigger}
          />
        </div>

        <div className="lg:col-span-2">
          <DailyFoodLog
            selectedDate={selectedDate}
            onDataChange={handleDataChange}
          />
        </div>
      </div>
    </div>
  )
}