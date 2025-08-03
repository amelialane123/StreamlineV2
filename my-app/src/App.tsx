import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import DiscoverPage from "./pages/DiscoverPage"
import ProfilePage from "./pages/ProfilePage"
import TitlePage from "./pages/TitlePage"
import FriendsPage from "./pages/FriendsPage"
import UserProfilePage from "./pages/UserProfilePage"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/title/:slug" element={<TitlePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
