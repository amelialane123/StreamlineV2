"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { SiteHeader } from "../components/SiteHeader"
import { MovieCard } from "../components/MovieCard"
import { ScrollArea } from "../components/ui/scroll-area"
import { PlusCircle, Users, Film, Tv2, ListChecks, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "../services/api"

interface ContentItem {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
}

interface UserList {
  id: number
  name: string
  content: ContentItem[]
}

export default function ProfilePage() {
  const [userLists, setUserLists] = useState<UserList[]>([])
  const [watchedMovies, setWatchedMovies] = useState<ContentItem[]>([])
  const [watchedShows, setWatchedShows] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [lists, watched] = await Promise.all([apiService.getUserLists(), apiService.getUserWatched()])

        // Mock data for demonstration
        setUserLists([
          {
            id: 1,
            name: "Must Watch",
            content: [
              {
                id: 1,
                title: "The Gentlemen",
                image: "/placeholder.svg?height=450&width=300",
                rating: 4.3,
                year: 2024,
                platforms: ["Netflix"],
              },
              {
                id: 2,
                title: "Fallout",
                image: "/placeholder.svg?height=450&width=300",
                rating: 4.5,
                year: 2024,
                platforms: ["Prime Video"],
              },
            ],
          },
          {
            id: 2,
            name: "Sci-Fi Favorites",
            content: [
              {
                id: 3,
                title: "Foundation",
                image: "/placeholder.svg?height=450&width=300",
                rating: 4.6,
                year: 2023,
                platforms: ["Apple TV+"],
              },
            ],
          },
        ])

        setWatchedMovies([
          {
            id: 4,
            title: "Oppenheimer",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.7,
            year: 2023,
            platforms: ["Prime Video"],
          },
          {
            id: 5,
            title: "Poor Things",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.5,
            year: 2023,
            platforms: ["Hulu"],
          },
        ])

        setWatchedShows([
          {
            id: 6,
            title: "The Bear",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.9,
            year: 2023,
            platforms: ["Hulu", "Disney+"],
          },
          {
            id: 7,
            title: "Shogun",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.6,
            year: 2024,
            platforms: ["Hulu", "Disney+"],
          },
        ])
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Profile" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>Jane Doe</CardTitle>
                        <CardDescription>@janedoe</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Bio</h3>
                      <p className="text-sm text-muted-foreground">
                        Film enthusiast and TV show binger. Always looking for the next great story to get lost in.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Streaming Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Netflix</Badge>
                        <Badge>HBO Max</Badge>
                        <Badge>Disney+</Badge>
                        <Badge>Prime Video</Badge>
                        <Badge>Apple TV+</Badge>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Sci-Fi</Badge>
                        <Badge variant="secondary">Drama</Badge>
                        <Badge variant="secondary">Thriller</Badge>
                        <Badge variant="secondary">Comedy</Badge>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" /> Friends
                      </h3>
                      <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Friend" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Friend" />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Friend" />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Friend" />
                          <AvatarFallback>D</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="h-8 w-8 rounded-full ml-2 bg-transparent">
                          <PlusCircle className="h-4 w-4" />
                          <span className="sr-only">Add friend</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Stats</h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted rounded-md p-2">
                          <div className="text-2xl font-bold">127</div>
                          <div className="text-xs text-muted-foreground">Watched</div>
                        </div>
                        <div className="bg-muted rounded-md p-2">
                          <div className="text-2xl font-bold">43</div>
                          <div className="text-xs text-muted-foreground">Watchlist</div>
                        </div>
                        <div className="bg-muted rounded-md p-2">
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-xs text-muted-foreground">Lists</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="watchlists" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="watchlists" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Watchlists
                  </TabsTrigger>
                  <TabsTrigger value="movies" className="flex items-center gap-2">
                    <Film className="h-4 w-4" /> Movies
                  </TabsTrigger>
                  <TabsTrigger value="shows" className="flex items-center gap-2">
                    <Tv2 className="h-4 w-4" /> TV Shows
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="watchlists" className="mt-6 space-y-6">
                  {userLists.map((list) => (
                    <div key={list.id}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{list.name}</h3>
                        <Button variant="outline" size="sm">
                          Edit List
                        </Button>
                      </div>
                      <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex w-max space-x-4 p-1">
                          {list.content.map((item) => (
                            <MovieCard
                              key={item.id}
                              id={item.id}
                              title={item.title}
                              image={item.image}
                              rating={item.rating}
                              year={item.year}
                              platforms={item.platforms}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}

                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New List
                  </Button>
                </TabsContent>

                <TabsContent value="movies" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Recently Watched Movies</h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {watchedMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        image={movie.image}
                        rating={movie.rating}
                        year={movie.year}
                        platforms={movie.platforms}
                        watched={true}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="shows" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Recently Watched Shows</h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {watchedShows.map((show) => (
                      <MovieCard
                        key={show.id}
                        id={show.id}
                        title={show.title}
                        image={show.image}
                        rating={show.rating}
                        year={show.year}
                        platforms={show.platforms}
                        watched={true}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
