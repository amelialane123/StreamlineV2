"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SiteHeader } from "../components/SiteHeader"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Star, Plus, Check, Eye, Calendar, Clock, Users } from "lucide-react"
import { AddToListDialog } from "../components/AddToListDialog"
import { ComparisonDialog } from "../components/ComparisonDialog"
import { apiService } from "../services/api"

interface ContentDetails {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  genres: string[]
  runtime: number
  description: string
  cast: string[]
  director: string
  watched?: boolean
  seasons?: number | null // Allow null for seasons
  episodes?: number | null // Allow null for episodes
}

export default function TitlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<ContentDetails | null>(null)
  const [isWatched, setIsWatched] = useState(false)
  const [showAddToList, setShowAddToList] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return

      setLoading(true)
      try {
        const contentData = await apiService.getContentById(Number.parseInt(slug))
        // Mock additional details since API might not have them
        const detailedContent: ContentDetails = {
          ...contentData,
          genres: ["Sci-Fi", "Adventure", "Drama"],
          runtime: 155,
          description:
            "In a distant future, humanity faces extinction as their home planet becomes uninhabitable. A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
          cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
          director: "Christopher Nolan",
          // Example of how seasons/episodes might be set, allowing for null or undefined
          seasons: contentData.type === "TV Series" ? 2 : null,
          episodes: contentData.type === "TV Series" ? 18 : null,
        }
        setContent(detailedContent)
        setIsWatched(detailedContent.watched || false)
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [slug])

  const handleMarkAsWatched = () => {
    if (!isWatched) {
      setShowComparison(true)
    } else {
      setIsWatched(false)
    }
  }

  const handleComparisonComplete = () => {
    setIsWatched(true)
    setShowComparison(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading content...</p>
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
            <h1 className="text-2xl font-bold mb-2">Content not found</h1>
            <p className="text-muted-foreground">The content you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container py-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Poster */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="aspect-[2/3] overflow-hidden rounded-lg mb-4">
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        variant={isWatched ? "secondary" : "default"}
                        onClick={handleMarkAsWatched}
                      >
                        {isWatched ? <Check className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {isWatched ? "Watched" : "Mark as Watched"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setShowAddToList(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to List
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{content.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{content.runtime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">{content.rating}</span>
                        </div>
                        {content.seasons != null && content.episodes != null && (
                          <div className="flex items-center gap-1">
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
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2">
                      {content.genres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Overview</h2>
                      <p className="text-muted-foreground leading-relaxed">{content.description}</p>
                    </div>

                    {/* Streaming Platforms */}
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Available On</h2>
                      <div className="flex flex-wrap gap-2">
                        {content.platforms.map((platform) => (
                          <Badge key={platform}>{platform}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tabs for additional info */}
                    <Tabs defaultValue="cast" className="w-full">
                      <TabsList>
                        <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        <TabsTrigger value="similar">Similar</TabsTrigger>
                      </TabsList>

                      <TabsContent value="cast" className="mt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Director</h3>
                            <p className="text-muted-foreground">{content.director}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Cast</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {content.cast.map((actor) => (
                                <p key={actor} className="text-muted-foreground">
                                  {actor}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="reviews" className="mt-6">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Great storytelling!</CardTitle>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">4.5</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                An incredible journey through space and time. The visuals are stunning and the emotional
                                core is powerful.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Users className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">@moviefan123</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="similar" className="mt-6">
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Similar content recommendations coming soon!</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddToListDialog
        open={showAddToList}
        onOpenChange={setShowAddToList}
        contentId={content.id}
        contentTitle={content.title}
      />

      <ComparisonDialog
        open={showComparison}
        onOpenChange={setShowComparison}
        newContentId={content.id}
        newContentTitle={content.title}
        onComplete={handleComparisonComplete}
      />
    </>
  )
}
