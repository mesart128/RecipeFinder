import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Search, Filter, X } from "lucide-react"

interface RecipeFiltersProps {
  filters: {
    search: string
    cuisine: string
    difficulty: string
    maxTime: number
  }
  onFiltersChange: (filters: any) => void
}

export function RecipeFilters({ filters, onFiltersChange }: RecipeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleCuisineChange = (value: string) => {
    onFiltersChange({ ...filters, cuisine: value === 'all' ? '' : value })
  }

  const handleDifficultyChange = (value: string) => {
    onFiltersChange({ ...filters, difficulty: value === 'all' ? '' : value })
  }

  const handleTimeChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxTime: value[0] })
  }

  const clearFilters = () => {
    onFiltersChange({ search: '', cuisine: '', difficulty: '', maxTime: 0 })
  }

  const hasActiveFilters = filters.cuisine || filters.difficulty || filters.maxTime > 0

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-md"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-orange-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-orange-500 text-white rounded-full w-2 h-2"></span>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuisine</label>
                <Select value={filters.cuisine || 'all'} onValueChange={handleCuisineChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cuisines</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Mexican">Mexican</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={filters.difficulty || 'all'} onValueChange={handleDifficultyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max cooking time: {filters.maxTime > 0 ? `${filters.maxTime} min` : 'Any'}
                </label>
                <Slider
                  value={[filters.maxTime]}
                  onValueChange={handleTimeChange}
                  max={120}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}