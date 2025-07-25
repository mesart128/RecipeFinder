import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Progress } from "./ui/progress"
import { UserProfile, saveUserProfile } from "../api/userProfile"
import { useToast } from "../hooks/useToast"
import { ChefHat, Heart, Utensils, Target, AlertTriangle, Flame, Clock, Loader2 } from "lucide-react"

interface ProfileQuestionnaireProps {
  onComplete: (profile: UserProfile) => void
  onClose: () => void
}

export function ProfileQuestionnaire({ onComplete, onClose }: ProfileQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    cuisinePreferences: [] as string[],
    calorieGoal: 2000,
    activityLevel: '' as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | '',
    healthGoals: [] as string[],
    dislikedIngredients: [] as string[],
    cookingSkillLevel: '' as 'beginner' | 'intermediate' | 'advanced' | '',
    mealTypes: [] as string[],
    spicePreference: '' as 'mild' | 'medium' | 'spicy' | ''
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const dietaryOptions = [
    'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean', 'low-carb', 'gluten-free'
  ]

  const allergyOptions = [
    'nuts', 'dairy', 'eggs', 'soy', 'shellfish', 'fish', 'wheat', 'sesame'
  ]

  const cuisineOptions = [
    'Italian', 'Japanese', 'Mexican', 'Thai', 'Mediterranean', 'Indian', 'Chinese', 'French', 'American', 'Korean'
  ]

  const healthGoalOptions = [
    'weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'heart_health', 'diabetes_management'
  ]

  const mealTypeOptions = [
    'breakfast', 'lunch', 'dinner', 'snacks', 'desserts'
  ]

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      console.log("Saving user profile:", formData)

      const response = await saveUserProfile(formData) as { profile: UserProfile }

      toast({
        title: "Profile Created!",
        description: "Your personalized profile has been saved successfully.",
      })

      onComplete(response.profile)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                Dietary Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tell us about your dietary preferences and restrictions.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`diet-${option}`}
                      checked={formData.dietaryRestrictions.includes(option)}
                      onCheckedChange={() =>
                        toggleArrayItem(
                          formData.dietaryRestrictions,
                          option,
                          (arr) => setFormData({...formData, dietaryRestrictions: arr})
                        )
                      }
                    />
                    <Label htmlFor={`diet-${option}`} className="capitalize cursor-pointer">
                      {option.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Allergies & Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Please select any food allergies or ingredients you need to avoid.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${allergy}`}
                      checked={formData.allergies.includes(allergy)}
                      onCheckedChange={() =>
                        toggleArrayItem(
                          formData.allergies,
                          allergy,
                          (arr) => setFormData({...formData, allergies: arr})
                        )
                      }
                    />
                    <Label htmlFor={`allergy-${allergy}`} className="capitalize cursor-pointer">
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="disliked">Other ingredients you dislike (comma-separated)</Label>
                <Textarea
                  id="disliked"
                  placeholder="e.g., mushrooms, olives, cilantro"
                  value={formData.dislikedIngredients.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    dislikedIngredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                Cuisine Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Which cuisines do you enjoy most?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cuisineOptions.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cuisine-${cuisine}`}
                      checked={formData.cuisinePreferences.includes(cuisine)}
                      onCheckedChange={() =>
                        toggleArrayItem(
                          formData.cuisinePreferences,
                          cuisine,
                          (arr) => setFormData({...formData, cuisinePreferences: arr})
                        )
                      }
                    />
                    <Label htmlFor={`cuisine-${cuisine}`} className="cursor-pointer">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="spice">Spice Preference</Label>
                <Select
                  value={formData.spicePreference}
                  onValueChange={(value: 'mild' | 'medium' | 'spicy') =>
                    setFormData({...formData, spicePreference: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select spice level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-green-500" />
                        Mild
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="spicy">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-500" />
                        Spicy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Health & Fitness Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calorie Goal</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calorieGoal}
                  onChange={(e) => setFormData({...formData, calorieGoal: parseInt(e.target.value) || 2000})}
                  min="1200"
                  max="4000"
                />
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') =>
                    setFormData({...formData, activityLevel: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Health Goals</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthGoalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={formData.healthGoals.includes(goal)}
                        onCheckedChange={() =>
                          toggleArrayItem(
                            formData.healthGoals,
                            goal,
                            (arr) => setFormData({...formData, healthGoals: arr})
                          )
                        }
                      />
                      <Label htmlFor={`goal-${goal}`} className="capitalize cursor-pointer">
                        {goal.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Cooking Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cooking Skill Level</Label>
                <Select
                  value={formData.cookingSkillLevel}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                    setFormData({...formData, cookingSkillLevel: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your cooking level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (simple recipes)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (moderate complexity)</SelectItem>
                    <SelectItem value="advanced">Advanced (complex techniques)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Meal Types You're Interested In</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypeOptions.map((meal) => (
                    <div key={meal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`meal-${meal}`}
                        checked={formData.mealTypes.includes(meal)}
                        onCheckedChange={() =>
                          toggleArrayItem(
                            formData.mealTypes,
                            meal,
                            (arr) => setFormData({...formData, mealTypes: arr})
                          )
                        }
                      />
                      <Label htmlFor={`meal-${meal}`} className="capitalize cursor-pointer">
                        {meal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Review your profile before we create your personalized AI assistant.
              </p>
              <div className="space-y-3">
                {formData.dietaryRestrictions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Dietary Preferences:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.dietaryRestrictions.map(item => (
                        <Badge key={item} variant="secondary" className="text-xs">
                          {item.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formData.allergies.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Allergies:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.allergies.map(item => (
                        <Badge key={item} variant="destructive" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formData.cuisinePreferences.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Favorite Cuisines:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.cuisinePreferences.map(item => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Calorie Goal:</Label>
                    <p className="text-muted-foreground">{formData.calorieGoal} calories/day</p>
                  </div>
                  <div>
                    <Label className="font-medium">Activity Level:</Label>
                    <p className="text-muted-foreground capitalize">{formData.activityLevel.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Cooking Level:</Label>
                    <p className="text-muted-foreground capitalize">{formData.cookingSkillLevel}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Spice Preference:</Label>
                    <p className="text-muted-foreground capitalize">{formData.spicePreference}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            Create Your Culinary Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}