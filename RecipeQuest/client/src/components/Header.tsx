import { Search, ChefHat, Bot, BookOpen } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useNavigate, useLocation } from "react-router-dom"
import { Input } from "./ui/input"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { PremiumFeatures } from "./PremiumFeatures"

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    // This would trigger a search in the HomePage component
    navigate(`/?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="flex items-center gap-2 text-xl font-bold cursor-pointer hover:text-primary/80 transition-colors"
          onClick={() => navigate("/")}
        >
          <ChefHat className="h-6 w-6 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Recipe Finder
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            onClick={() => navigate("/")}
            className={location.pathname === "/" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : ""}
          >
            Recipes
          </Button>
          <Button
            variant={location.pathname === "/food-diary" ? "default" : "ghost"}
            onClick={() => navigate("/food-diary")}
            className={location.pathname === "/food-diary" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : ""}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Food Diary
          </Button>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
              <PremiumFeatures />
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}