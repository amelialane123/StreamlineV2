"use client"

import { Link } from "react-router-dom"
import { Search, TrendingUp, Clock, CheckCircle, Plus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ScrollArea } from "../components/ui/scroll-area"
import { MovieCard } from "../components/MovieCard"
import { SiteHeader } from "../components/SiteHeader"
import { useEffect, useState } from "react"
import { apiService } from "../services/api"

interface ContentItem {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  watched?: boolean
}

export default function HomePage() {
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([])
  const [watchlistContent, setWatchlistContent] = useState<ContentItem[]>([])
  const [watchedContent, setWatchedContent] = useState<ContentItem[]>([])
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, watchlist, watched, recommended] = await Promise.all([
          apiService.getTrendingContent(),
          apiService.getUserWatchlist(),
          apiService.getUserWatched(),
          apiService.getRecommendedContent(),
        ])

        setTrendingContent(trending)
        setWatchlistContent(watchlist)
        setWatchedContent(watched)
        setRecommendedContent(recommended)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set mock data for development
        setTrendingContent([
          {
            id: 1,
            title: "Dune: Part Two",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.8,
            year: 2024,
            platforms: ["HBO Max", "Prime Video"],
          },
          {
            id: 2,
            title: "The Bear",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.9,
            year: 2023,
            platforms: ["Hulu", "Disney+"],
          },
        ])
        setRecommendedContent([
          {
            id: 3,
            title: "Slow Horses",
            image: "/placeholder.svg?height=450&width=300",
            rating: 4.7,
            year: 2023,
            platforms: ["Apple TV+"],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Welcome to WatchTracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Your one-stop shop to track shows and movies across all streaming platforms.
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search for movies and shows..." />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="container pb-8">
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="watchlist">Your Watchlist</TabsTrigger>
              <TabsTrigger value="watched">Recently Watched</TabsTrigger>
            </TabsList>
            <TabsContent value="trending" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Trending Now
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/discover">View all</Link>
                </Button>
              </div>
              <ScrollArea className="w-full whitespace-nowrap pb-6">
                <div className="flex w-max space-x-4 p-1">
                  {trendingContent.map((item) => (
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
            </TabsContent>
            <TabsContent value="watchlist" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Your Watchlist
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">Manage lists</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Must Watch</h3>
                  <div className="flex flex-col gap-2">
                    {watchlistContent.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>{item.title}</span>
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
                  <Button variant="ghost" className="h-full w-full flex flex-col gap-2">
                    <Plus className="h-8 w-8" />
                    <span>Create New List</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="watched" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Recently Watched
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">View all</Link>
                </Button>
              </div>
              <ScrollArea className="w-full whitespace-nowrap pb-6">
                <div className="flex w-max space-x-4 p-1">
                  {watchedContent.map((item) => (
                    <MovieCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      image={item.image}
                      rating={item.rating}
                      year={item.year}
                      platforms={item.platforms}
                      watched={true}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </section>

        <section className="container pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/discover">More recommendations</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendedContent.map((item) => (
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
        </section>
      </main>
    </div>
  )
}
