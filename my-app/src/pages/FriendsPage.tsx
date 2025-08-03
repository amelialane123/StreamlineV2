"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SiteHeader } from "../components/SiteHeader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Search, Users, UserPlus, UserCheck } from "lucide-react"
import { apiService } from "../services/api"

interface User {
  id: number
  username: string
  display_name: string
  avatar: string
  followers_count: number
  following_count: number
  is_following: boolean
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchSocialData = async () => {
      setLoading(true)
      try {
        const [followersData, followingData] = await Promise.all([apiService.getFollowers(), apiService.getFollowing()])
        // Ensure mock data has all required fields
        setFollowers(
          followersData.map((user) => ({ ...user, followers_count: 0, following_count: 0, is_following: false })),
        )
        setFollowing(
          followingData.map((user) => ({ ...user, followers_count: 0, following_count: 0, is_following: true })),
        )
      } catch (error) {
        console.error("Error fetching social data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSocialData()
  }, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const results = await apiService.searchUsers(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleFollow = async (userId: number) => {
    try {
      await apiService.followUser(userId)
      // Update the search results to reflect the new follow status
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_following: true, followers_count: user.followers_count + 1 } : user,
        ),
      )
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  const handleUnfollow = async (userId: number) => {
    try {
      await apiService.unfollowUser(userId)
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_following: false, followers_count: user.followers_count - 1 } : user,
        ),
      )
    } catch (error) {
      console.error("Error unfollowing user:", error)
    }
  }

  const UserCard = ({ user }: { user: User }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link to={`/user/${user.id}`} className="flex items-center gap-3 hover:opacity-80">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.display_name} />
              <AvatarFallback>{user.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.display_name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </Link>
          <Button
            variant={user.is_following ? "outline" : "default"}
            size="sm"
            onClick={() => (user.is_following ? handleUnfollow(user.id) : handleFollow(user.id))}
          >
            {user.is_following ? (
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
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{user.followers_count} followers</span>
          <span>{user.following_count} following</span>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading friends...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Find Friends</h1>
              <p className="text-muted-foreground">Discover and connect with other movie and TV show enthusiasts</p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for users by username or name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {searchQuery && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {searchLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid gap-4">
                    {searchResults.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}

            <Tabs defaultValue="following" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
                <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="following" className="mt-6">
                {following.length > 0 ? (
                  <div className="grid gap-4">
                    {following.map((user) => (
                      <UserCard
                        key={user.id}
                        user={{ ...user, is_following: true, followers_count: 0, following_count: 0 }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No one followed yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start following friends to see their activity and recommendations
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followers" className="mt-6">
                {followers.length > 0 ? (
                  <div className="grid gap-4">
                    {followers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={{ ...user, is_following: false, followers_count: 0, following_count: 0 }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
                    <p className="text-muted-foreground">
                      Share your profile with friends to start building your network
                    </p>
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
