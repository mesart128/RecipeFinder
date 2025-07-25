import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { UserProfile } from "../api/userProfile"
import { AIRecommendation, ChatMessage, getAIRecommendations, chatWithAI, generateMealPlan } from "../api/aiAssistant"
import { useToast } from "../hooks/useToast"
import { Bot, Send, Sparkles, Calendar, Utensils, Loader2, Star } from "lucide-react"
import { RecipeCard } from "./RecipeCard"

interface AIAssistantProps {
  userProfile: UserProfile
  onClose: () => void
}

export function AIAssistant({ userProfile, onClose }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState("chat")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null)
  const [mealPlan, setMealPlan] = useState<{ [key: string]: AIRecommendation } | null>(null)
  const [conversationId, setConversationId] = useState<string>("")
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial greeting
    const greeting: ChatMessage = {
      _id: 'greeting',
      role: 'assistant',
      content: `Hello! I'm your personalized AI culinary assistant. Based on your profile, I can see you enjoy ${userProfile.cuisinePreferences.join(', ')} cuisine${userProfile.cuisinePreferences.length > 1 ? 's' : ''} and have a ${userProfile.calorieGoal} calorie daily goal. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
    setChatMessages([greeting])
  }, [userProfile])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      _id: `user_${Date.now()}`,
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setLoading(true)

    try {
      const response = await chatWithAI({
        message: currentMessage,
        conversationId
      }) as { response: ChatMessage; conversationId: string }

      setChatMessages(prev => [...prev, response.response])
      setConversationId(response.conversationId)
    } catch (error) {
      console.error("Error chatting with AI:", error)
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGetRecommendations = async () => {
    setLoading(true)
    try {
      const response = await getAIRecommendations({
        preferences: `Dietary: ${userProfile.dietaryRestrictions.join(', ')}, Allergies: ${userProfile.allergies.join(', ')}, Cuisines: ${userProfile.cuisinePreferences.join(', ')}`,
        mealType: 'any'
      }) as { recommendation: AIRecommendation }

      setRecommendations(response.recommendation)
      setActiveTab("recommendations")
    } catch (error) {
      console.error("Error getting recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMealPlan = async () => {
    setLoading(true)
    try {
      const response = await generateMealPlan({
        days: 7,
        preferences: `Calorie goal: ${userProfile.calorieGoal}, Activity: ${userProfile.activityLevel}`
      }) as { mealPlan: { [key: string]: AIRecommendation } }

      setMealPlan(response.mealPlan)
      setActiveTab("meal-plan")
    } catch (error) {
      console.error("Error generating meal plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-500" />
            AI Culinary Assistant
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="meal-plan" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meal Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 h-[500px] flex flex-col">
            <ScrollArea className="flex-1 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-orange-100' : 'text-muted-foreground'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me about recipes, nutrition, or cooking tips..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !currentMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGetRecommendations}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                <Star className="h-4 w-4 mr-2" />
                Get Recipe Recommendations
              </Button>
              <Button
                onClick={handleGenerateMealPlan}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate Meal Plan
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations ? (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{recommendations.reasoning}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Calories:</span>
                        <span className="ml-2">{recommendations.nutritionalInfo.totalCalories}</span>
                      </div>
                      <div>
                        <span className="font-medium">Protein:</span>
                        <span className="ml-2">{recommendations.nutritionalInfo.protein}g</span>
                      </div>
                      <div>
                        <span className="font-medium">Carbs:</span>
                        <span className="ml-2">{recommendations.nutritionalInfo.carbs}g</span>
                      </div>
                      <div>
                        <span className="font-medium">Fat:</span>
                        <span className="ml-2">{recommendations.nutritionalInfo.fat}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Get Recipe Recommendations" to get personalized suggestions based on your profile.
                </p>
                <Button
                  onClick={handleGetRecommendations}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="meal-plan" className="space-y-4">
            {mealPlan ? (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      7-Day Meal Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Personalized meal plan based on your dietary preferences and calorie goals.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  {Object.entries(mealPlan).map(([day, plan]) => (
                    <Card key={day} className="border-0 shadow-lg bg-white">
                      <CardHeader>
                        <CardTitle className="capitalize">
                          {day.replace('day', 'Day ')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.reasoning}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {plan.mealPlan?.breakfast && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Utensils className="h-4 w-4 text-orange-500" />
                                Breakfast
                              </h4>
                              <RecipeCard recipe={plan.mealPlan.breakfast} />
                            </div>
                          )}
                          {plan.mealPlan?.lunch && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Utensils className="h-4 w-4 text-blue-500" />
                                Lunch
                              </h4>
                              <RecipeCard recipe={plan.mealPlan.lunch} />
                            </div>
                          )}
                          {plan.mealPlan?.dinner && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Utensils className="h-4 w-4 text-purple-500" />
                                Dinner
                              </h4>
                              <RecipeCard recipe={plan.mealPlan.dinner} />
                            </div>
                          )}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Calories:</span>
                              <span className="ml-1">{plan.nutritionalInfo.totalCalories}</span>
                            </div>
                            <div>
                              <span className="font-medium">Protein:</span>
                              <span className="ml-1">{plan.nutritionalInfo.protein}g</span>
                            </div>
                            <div>
                              <span className="font-medium">Carbs:</span>
                              <span className="ml-1">{plan.nutritionalInfo.carbs}g</span>
                            </div>
                            <div>
                              <span className="font-medium">Fat:</span>
                              <span className="ml-1">{plan.nutritionalInfo.fat}g</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No meal plan yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a personalized 7-day meal plan based on your dietary preferences and goals.
                </p>
                <Button
                  onClick={handleGenerateMealPlan}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Generate Meal Plan
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}