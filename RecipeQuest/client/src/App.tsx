import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { RecipeDetailPage } from "./pages/RecipeDetailPage"
import { FoodDiaryPage } from "./pages/FoodDiaryPage"
import { BlankPage } from "./pages/BlankPage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/food-diary" element={<FoodDiaryPage />} />
          </Route>
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App