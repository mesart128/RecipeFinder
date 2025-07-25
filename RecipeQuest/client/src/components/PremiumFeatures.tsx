import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { UserProfile, UserSubscription, getUserProfile, getUserSubscription } from "../api/userProfile"
import { ProfileQuestionnaire } from "./ProfileQuestionnaire"
import { AIAssistant } from "./AIAssistant"
import { useToast } from "../hooks/useToast"
import { Bot, Crown, Sparkles, Star, Calendar, Target, Loader2, Lock } from "lucide-react"

export function PremiumFeatures() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      setLoading(true)
      
      const [profileResponse, subscriptionResponse] = await Promise.all([
        getUserProfile() as Promise<{ profile: UserProfile }>,
        getUserSubscription() as Promise<{ subscription: UserSubscription }>
      ])

      setUserProfile(profileResponse.profile)
      setSubscription(subscriptionResponse.subscription)
    } catch (error) {
      console.error("Error checking user status:", error)
      // User might not have profile/subscription yet, which is fine
    } finally {
      setLoading(false)
    }
  }

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setShowQuestionnaire(false)
    toast({
      title: "Profile Created!",
      description: "Your AI assistant is now ready to help you.",
    })
  }

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active'

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Premium Status Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Premium Features
            {isPremium && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPremium ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Unlock personalized AI recommendations and meal planning with Premium.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Bot className="h-8 w-8 text-purple-500" />
                  <div>
                    <h4 className="font-medium">AI Assistant</h4>
                    <p className="text-sm text-muted-foreground">Personal cooking advisor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Calendar className="h-8 w-8 text-green-500" />
                  <div>
                    <h4 className="font-medium">Meal Planning</h4>
                    <p className="text-sm text-muted-foreground">Weekly meal plans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Personalized</h4>
                    <p className="text-sm text-muted-foreground">Based on your profile</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Welcome to Premium! Your subscription is active until {new Date(subscription.expiresAt).toLocaleDateString()}.
              </p>
              
              {!userProfile ? (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Complete Your Profile</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      To get personalized AI recommendations, please complete your culinary profile.
                    </p>
                    <Button
                      onClick={() => setShowQuestionnaire(true)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Create Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Profile Complete!</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Your AI assistant is ready to provide personalized recommendations.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowAIAssistant(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        Open AI Assistant
                      </Button>
                      <Button
                        onClick={() => setShowQuestionnaire(true)}
                        variant="outline"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <Card className="bg-white border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Calorie Goal:</span>
                          <span className="ml-2">{userProfile.calorieGoal}/day</span>
                        </div>
                        <div>
                          <span className="font-medium">Activity Level:</span>
                          <span className="ml-2 capitalize">{userProfile.activityLevel.replace('_', ' ')}</span>
                        </div>
                        <div>
                          <span className="font-medium">Cooking Level:</span>
                          <span className="ml-2 capitalize">{userProfile.cookingSkillLevel}</span>
                        </div>
                        <div>
                          <span className="font-medium">Spice Preference:</span>
                          <span className="ml-2 capitalize">{userProfile.spicePreference}</span>
                        </div>
                      </div>
                      
                      {userProfile.cuisinePreferences.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Favorite Cuisines:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userProfile.cuisinePreferences.map(cuisine => (
                              <Badge key={cuisine} variant="outline" className="text-xs">
                                {cuisine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {userProfile.allergies.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Allergies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userProfile.allergies.map(allergy => (
                              <Badge key={allergy} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Free Users - Locked Features */}
      {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/80 z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Premium Feature</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-500" />
                AI Recipe Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Get personalized recipe recommendations based on your dietary preferences, allergies, and health goals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/80 z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Premium Feature</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Smart Meal Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Generate weekly meal plans tailored to your calorie goals, cooking skill level, and taste preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showQuestionnaire && (
        <ProfileQuestionnaire
          onComplete={handleProfileComplete}
          onClose={() => setShowQuestionnaire(false)}
        />
      )}

      {showAIAssistant && userProfile && (
        <AIAssistant
          userProfile={userProfile}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
    </div>
  )
}