import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Film, Home, Search, TrendingUp, User } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-8">
          <Film className="h-6 w-6" />
          <span>WatchTracker</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="flex items-center gap-1 font-medium transition-colors hover:text-primary">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/discover" className="flex items-center gap-1 font-medium transition-colors hover:text-primary">
            <TrendingUp className="h-4 w-4" />
            Discover
          </Link>
          <Link href="/profile" className="flex items-center gap-1 font-medium transition-colors hover:text-primary">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </nav>

        <div className="hidden md:flex items-center ml-auto gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-8 rounded-full bg-muted" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </div>

        <div className="md:hidden flex items-center ml-auto gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
