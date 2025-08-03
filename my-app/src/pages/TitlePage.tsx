"use client"

import { useParams } from "react-router-dom"
import { SiteHeader } from "../components/SiteHeader"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { MovieCard } from "../components/MovieCard"
import { ScrollArea } from "../components/ui/scroll-area"
import { Clock, Star, Share2, Heart, MessageSquare, CheckCircle, Calendar, Film, Tv2 } from "lucide-react"
import { useState, useEffect } from "react"

interface ContentDetails {
  id: number
  title: string
  year: number
  rating: number
  platforms: string[]
  image: string
  backdrop: string
  type: string
  runtime: string
  seasons?: number
  episodes?: number
  director: string
  cast: string[]
  genres: string[]
  description: string
}

export default function TitlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<ContentDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Mock data based on slug - in real app, you'd fetch from API
        const isShow = slug?.includes("bear") || slug?.includes("shogun")

        const mockContent: ContentDetails = {
          id: 1,
          title: isShow ? "The Bear" : "Dune: Part Two",
          year: isShow ? 2023 : 2024,
          rating: isShow ? 4.9 : 4.8,
          platforms: isShow ? ["Hulu", "Disney+"] : ["HBO Max", "Prime Video"],
          image: "/placeholder.svg?height=600&width=400",
          backdrop: "/placeholder.svg?height=600&width=1200",
          type: isShow ? "TV Series" : "Movie",
          runtime: isShow ? "30 min/episode" : "166 min",
          seasons: isShow ? 2 : undefined,
          episodes: isShow ? 18 : undefined,
          director: isShow ? "Christopher Storer" : "Denis Villeneuve",
          cast: isShow
            ? ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"]
            : ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
          genres: isShow ? ["Comedy", "Drama"] : ["Sci-Fi", "Adventure", "Drama"],
          description: isShow
            ? "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after the suicide of his brother. As he fights to transform the restaurant and himself, his kitchen staff become his new family."
            : "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
        }

        setContent(mockContent)
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [slug])

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

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-muted-foreground">The requested content could not be found.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={content.backdrop || "/placeholder.svg"}
            alt={`${content.title} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
          <div className="container relative h-full flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="hidden md:block w-64 rounded-md overflow-hidden shadow-lg">
                <img
                  src={content.image || "/placeholder.svg"}
                  alt={content.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {content.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {content.rating}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{content.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <Clock className="h-4 w-4" />
                    Add to Watchlist
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <CheckCircle className="h-4 w-4" />
                    Mark as Watched
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{content.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.type === "TV Series" ? (
                      <Tv2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Film className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{content.runtime}</span>
                  </div>
                  {content.seasons && (
                    <div className="flex items-center gap-2">
                      <span>
                        {content.seasons} {content.seasons === 1 ? "Season" : "Seasons"}
                      </span>
                      <span>•</span>
                      <span>
                        {content.episodes} {content.episodes === 1 ? "Episode" : "Episodes"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Available on</h3>
                  <div className="flex gap-2">
                    {content.platforms.map((platform) => (
                      <Badge key={platform} className="bg-primary/20 text-primary hover:bg-primary/30 border-0">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="md:hidden w-full flex justify-center mb-8">
            <div className="w-48 rounded-md overflow-hidden shadow-lg">
              <img src={content.image || "/placeholder.svg"} alt={content.title} className="w-full h-72 object-cover" />
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Synopsis</h2>
                <p className="text-muted-foreground">{content.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Similar Titles</h2>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-6">
                  <div className="flex w-max space-x-4 p-1">
                    <MovieCard
                      id={2}
                      title="Shogun"
                      image="/placeholder.svg?height=450&width=300"
                      rating={4.6}
                      year={2024}
                      platforms={["Hulu", "Disney+"]}
                    />
                    <MovieCard
                      id={3}
                      title="The Gentlemen"
                      image="/placeholder.svg?height=450&width=300"
                      rating={4.3}
                      year={2024}
                      platforms={["Netflix"]}
                    />
                    <MovieCard
                      id={4}
                      title="Severance"
                      image="/placeholder.svg?height=450&width=300"
                      rating={4.8}
                      year={2022}
                      platforms={["Apple TV+"]}
                    />
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="cast" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {content.cast.map((actor, index) => (
                    <div key={actor} className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-2">
                        <AvatarImage src={`/placeholder.svg?height=100&width=100`} alt={actor} />
                        <AvatarFallback>
                          {actor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{actor}</div>
                      <div className="text-xs text-muted-foreground">Character {index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Crew</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Director</div>
                    <div>{content.director}</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Writer</div>
                    <div>Writer Name</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Producer</div>
                    <div>Producer Name</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">User Reviews</h2>
                  <Button>Write a Review</Button>
                </div>

                <div className="grid gap-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="User" />
                          <AvatarFallback>MK</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">MovieKing42</div>
                          <div className="text-xs text-muted-foreground">March 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">
                      This is an incredible piece of entertainment. The attention to detail and character development is
                      phenomenal. Highly recommended!
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Heart className="h-4 w-4" />
                        124
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
