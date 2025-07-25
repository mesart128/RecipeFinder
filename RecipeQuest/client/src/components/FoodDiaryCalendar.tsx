import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { DailyNutrition, getNutritionSummary } from "../api/foodDiary"
import { useToast } from "../hooks/useToast"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"

interface FoodDiaryCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onRefresh: boolean
}

export function FoodDiaryCalendar({ selectedDate, onDateSelect, onRefresh }: FoodDiaryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [nutritionData, setNutritionData] = useState<{ [date: string]: DailyNutrition }>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchNutritionData()
  }, [currentMonth, onRefresh])

  const fetchNutritionData = async () => {
    try {
      setLoading(true)
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      
      const response = await getNutritionSummary(startDate, endDate) as { summary: { [date: string]: DailyNutrition } }
      setNutritionData(response.summary)
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      toast({
        title: "Error",
        description: "Failed to load nutrition data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getDayContent = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayData = nutritionData[dateStr]
    
    if (!dayData) return null

    return (
      <div className="w-full mt-1">
        <div className="text-xs text-center">
          <Badge 
            variant="secondary" 
            className="text-xs px-1 py-0 bg-orange-100 text-orange-800"
          >
            {dayData.totalCalories}cal
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            Food Diary Calendar
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border-0"
          components={{
            DayContent: ({ date }) => (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <span>{date.getDate()}</span>
                {getDayContent(date)}
              </div>
            )
          }}
        />
        
        {loading && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 animate-pulse" />
              Loading nutrition data...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}