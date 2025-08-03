"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SiteHeader } from "../components/SiteHeader"
import { MovieCard } from "../components/MovieCard"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { Film, Clock, Star, Users, UserPlus, UserCheck } from "lucide-react"
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

interface UserProfile {
  id: number
  username: string
  display_name: string
  avatar: string
  bio: string
  followers_count: number
  following_count: number
  is_following: boolean
  favorite_genres: string[]
  streaming_platforms: string[]
  watched_content: ContentItem[]
  watchlist_content: ContentItem[]
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return

      setLoading(true)
      try {
        const profileData = await apiService.getUserProfile(Number.parseInt(id))
        setUserProfile(profileData)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [id])

  const handleFollowToggle = async () => {
    if (!userProfile) return

    try {
      if (userProfile.is_following) {
        await apiService.unfollowUser(userProfile.id)
        setUserProfile((prev) =>
          prev ? { ...prev, is_following: false, followers_count: prev.followers_count - 1 } : null,
        )
      } else {
        await apiService.followUser(userProfile.id)
        setUserProfile((prev) =>
          prev ? { ...prev, is_following: true, followers_count: prev.followers_count + 1 } : null,
        )
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading user profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
            <p className="text-muted-foreground">The requested user profile could not be found.</p>
          </div>
        </main>
      </div>
    )
  }

  const totalWatched = userProfile.watched_content.length
  const averageRating =
    userProfile.watched_content.reduce((acc, item) => acc + item.rating, 0) / userProfile.watched_content.length || 0
  const watchlistProgress = (totalWatched / (totalWatched + userProfile.watchlist_content.length)) * 100 || 0

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.display_name} />
                    <AvatarFallback className="text-2xl">{userProfile.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">{userProfile.display_name}</CardTitle>
                        <p className="text-muted-foreground">@{userProfile.username}</p>
                      </div>

                      <Button
                        variant={userProfile.is_following ? "outline" : "default"}
                        onClick={handleFollowToggle}
                        className="w-fit"
                      >
                        {userProfile.is_following ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold">{userProfile.followers_count}</span>
                        <span className="text-muted-foreground">followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold">{userProfile.following_count}</span>
                        <span className="text-muted-foreground">following</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{userProfile.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.favorite_genres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Streaming Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.streaming_platforms.map((platform) => (
                        <Badge key={platform}>{platform}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    Total Watched
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWatched}</div>
                  <p className="text-xs text-muted-foreground">movies & shows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">out of 5 stars</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Watchlist Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{watchlistProgress.toFixed(0)}%</div>
                  <Progress value={watchlistProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userProfile.watchlist_content.length} items remaining
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="watched" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="watched" className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  Watched ({userProfile.watched_content.length})
                </TabsTrigger>
                <TabsTrigger value="watchlist" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Watchlist ({userProfile.watchlist_content.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="watched" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Recently Watched</h3>
                    {userProfile.watched_content.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {userProfile.watched_content.map((item) => (
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
                        <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No watched content yet</h3>
                        <p className="text-muted-foreground">Start watching movies and shows to see them here</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="watchlist" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Your Watchlist</h3>
                    {userProfile.watchlist_content.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {userProfile.watchlist_content.map((item) => (
                          <MovieCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            rating={item.rating}
                            year={item.year}
                            platforms={item.platforms}
                            watched={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                        <p className="text-muted-foreground">Add movies and shows you want to watch</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
