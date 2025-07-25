import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Ingredient, Store, findNearbyStores } from "../api/recipes"
import { useToast } from "../hooks/useToast"
import { MapPin, Phone, Clock, Navigation, Loader2, AlertCircle } from "lucide-react"

interface IngredientFinderProps {
  ingredients: Ingredient[]
  onClose: () => void
}

export function IngredientFinder({ ingredients, onClose }: IngredientFinderProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set(ingredients.map(i => i.name))
  )
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    console.log("Requesting user location...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        console.log("Location obtained:", location)
        setUserLocation(location)
        setLocationError("")
      },
      (error) => {
        console.error("Location error:", error)
        setLocationError("Unable to get your location. Please enable location services.")
      }
    )
  }

  const toggleIngredient = (ingredientName: string) => {
    const newSelected = new Set(selectedIngredients)
    if (newSelected.has(ingredientName)) {
      newSelected.delete(ingredientName)
    } else {
      newSelected.add(ingredientName)
    }
    setSelectedIngredients(newSelected)
    console.log("Toggled ingredient selection:", ingredientName)
  }

  const findStores = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please allow location access to find nearby stores.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("Finding stores for selected ingredients:", Array.from(selectedIngredients))
      
      const response = await findNearbyStores({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        ingredients: Array.from(selectedIngredients)
      }) as { stores: Store[] }
      
      setStores(response.stores)
      console.log("Found stores:", response.stores.length)
    } catch (error) {
      console.error("Error finding stores:", error)
      toast({
        title: "Error",
        description: "Failed to find nearby stores. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDirections = (store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`
    window.open(url, '_blank')
    console.log("Opening directions to:", store.name)
  }

  const callStore = (phone: string) => {
    window.location.href = `tel:${phone}`
    console.log("Calling store:", phone)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Find Ingredients Nearby
          </DialogTitle>
          <DialogDescription>
            Select the ingredients you need and find nearby stores that have them in stock.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ingredient Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select ingredients you need:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ingredients.map((ingredient) => (
                <div key={ingredient._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`find-${ingredient._id}`}
                    checked={selectedIngredients.has(ingredient.name)}
                    onCheckedChange={() => toggleIngredient(ingredient.name)}
                  />
                  <label
                    htmlFor={`find-${ingredient._id}`}
                    className="text-sm cursor-pointer"
                  >
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location Status */}
          {locationError && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{locationError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestLocation}
                    className="ml-auto"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Find Stores Button */}
          <Button
            onClick={findStores}
            disabled={loading || !userLocation || selectedIngredients.size === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finding Stores...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearby Stores
              </>
            )}
          </Button>

          {/* Store Results */}
          {stores.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Nearby Stores ({stores.length} found):</h3>
              <div className="space-y-4">
                {stores.map((store) => (
                  <Card key={store._id} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{store.name}</h4>
                          <p className="text-sm text-muted-foreground">{store.chain}</p>
                          <p className="text-sm text-muted-foreground">{store.address}</p>
                        </div>
                        <Badge variant="secondary">
                          {store.distance} mi away
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{store.hours}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{store.phone}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Available ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                          {store.availableIngredients.map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant={selectedIngredients.has(ingredient) ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => getDirections(store)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button
                          onClick={() => callStore(store.phone)}
                          variant="outline"
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}