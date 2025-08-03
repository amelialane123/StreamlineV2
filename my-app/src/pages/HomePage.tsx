"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SiteHeader } from "../components/SiteHeader"
import { MovieCard } from "../components/MovieCard"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { TrendingUp, Clock, Star, Plus } from "lucide-react"
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
  const [watchlist, setWatchlist] = useState<ContentItem[]>([])
  const [recentlyWatched, setRecentlyWatched] = useState<ContentItem[]>([])
  const [recommendations, setRecommendations] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [trending, userWatchlist, userWatched, userRecommendations] = await Promise.all([
          apiService.getTrendingContent(),
          apiService.getUserWatchlist(),
          apiService.getUserWatched(),
          apiService.getRecommendedContent(),
        ])

        setTrendingContent(trending)
        setWatchlist(userWatchlist)
        setRecentlyWatched(userWatched)
        setRecommendations(userRecommendations)
      } catch (error) {
        console.error("Error fetching data:", error)
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
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Discover your next favorite movie or TV show</p>
          </div>

          <div className="grid gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{watchlist.length}</div>
                  <p className="text-xs text-muted-foreground">items to watch</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Watched</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentlyWatched.length}</div>
                  <p className="text-xs text-muted-foreground">this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trending</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trendingContent.length}</div>
                  <p className="text-xs text-muted-foreground">hot right now</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recommendations.length}</div>
                  <p className="text-xs text-muted-foreground">for you</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="watched">Recently Watched</TabsTrigger>
                <TabsTrigger value="recommendations">For You</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Trending Now</h2>
                  <Button variant="outline" asChild>
                    <Link to="/discover">View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {trendingContent.map((item) => (
                    <MovieCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      image={item.image}
                      rating={item.rating}
                      year={item.year}
                      platforms={item.platforms}
                      watched={item.watched}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="watchlist" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Your Watchlist</h2>
                  <Badge variant="secondary">{watchlist.length} items</Badge>
                </div>
                {watchlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchlist.map((item) => (
                      <MovieCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        rating={item.rating}
                        year={item.year}
                        platforms={item.platforms}
                        watched={item.watched}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                    <p className="text-muted-foreground mb-4">Start adding movies and shows you want to watch</p>
                    <Button asChild>
                      <Link to="/discover">Discover Content</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="watched" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Recently Watched</h2>
                  <Badge variant="secondary">{recentlyWatched.length} items</Badge>
                </div>
                {recentlyWatched.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {recentlyWatched.map((item) => (
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
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                    <p className="text-muted-foreground mb-4">Start watching and rating content to see it here</p>
                    <Button asChild>
                      <Link to="/discover">Find Something to Watch</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Recommended for You</h2>
                  <Badge variant="secondary">{recommendations.length} items</Badge>
                </div>
                {recommendations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {recommendations.map((item) => (
                      <MovieCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        rating={item.rating}
                        year={item.year}
                        platforms={item.platforms}
                        watched={item.watched}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
