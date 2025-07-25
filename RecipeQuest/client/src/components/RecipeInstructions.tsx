import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { BookOpen, CheckCircle } from "lucide-react"
import { useState } from "react"

interface RecipeInstructionsProps {
  instructions: string[]
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex)
    } else {
      newCompleted.add(stepIndex)
    }
    setCompletedSteps(newCompleted)
    console.log("Toggled step:", stepIndex + 1, "Completed:", !completedSteps.has(stepIndex))
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-500" />
          Instructions
          <Badge variant="secondary" className="ml-auto">
            {completedSteps.size}/{instructions.length} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className={`flex gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                completedSteps.has(index)
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
              }`}
              onClick={() => toggleStep(index)}
            >
              <div className="flex-shrink-0">
                {completedSteps.has(index) ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`leading-relaxed ${
                    completedSteps.has(index)
                      ? 'text-green-800 line-through'
                      : 'text-foreground'
                  }`}
                >
                  {instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}