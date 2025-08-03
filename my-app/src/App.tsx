import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import HomePage from "./pages/HomePage"
import DiscoverPage from "./pages/DiscoverPage"
import ProfilePage from "./pages/ProfilePage"
import TitlePage from "./pages/TitlePage"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="watchtracker-theme">
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/title/:slug" element={<TitlePage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
