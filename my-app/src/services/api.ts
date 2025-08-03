interface ContentItem {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  watched?: boolean
  type?: string // Added type for TitlePage logic
}

interface User {
  id: number
  username: string
  display_name: string
  avatar: string
  followers_count: number
  following_count: number
  is_following: boolean
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

interface FilterState {
  search: string
  contentType: string
  platform: string
  genres: string[]
  minRating: number
  yearRange: [number, number]
  platforms: string[]
  runtimeRange: [number, number]
}

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    image: "/placeholder.svg?height=450&width=300&text=Dune+Part+Two",
    rating: 4.8,
    year: 2024,
    platforms: ["HBO Max", "Prime Video"],
    type: "Movie",
  },
  {
    id: 2,
    title: "The Bear",
    image: "/placeholder.svg?height=450&width=300&text=The+Bear",
    rating: 4.9,
    year: 2023,
    platforms: ["Hulu", "Disney+"],
    type: "TV Series",
  },
  {
    id: 3,
    title: "Slow Horses",
    image: "/placeholder.svg?height=450&width=300&text=Slow+Horses",
    rating: 4.7,
    year: 2023,
    platforms: ["Apple TV+"],
    type: "TV Series",
  },
  {
    id: 4,
    title: "Oppenheimer",
    image: "/placeholder.svg?height=450&width=300&text=Oppenheimer",
    rating: 4.7,
    year: 2023,
    platforms: ["Prime Video"],
    type: "Movie",
  },
  {
    id: 5,
    title: "Poor Things",
    image: "/placeholder.svg?height=450&width=300&text=Poor+Things",
    rating: 4.5,
    year: 2023,
    platforms: ["Hulu"],
    type: "Movie",
  },
  {
    id: 6,
    title: "Shogun",
    image: "/placeholder.svg?height=450&width=300&text=Shogun",
    rating: 4.6,
    year: 2024,
    platforms: ["Hulu", "Disney+"],
    type: "TV Series",
  },
  {
    id: 7,
    title: "The Gentlemen",
    image: "/placeholder.svg?height=450&width=300&text=The+Gentlemen",
    rating: 4.3,
    year: 2024,
    platforms: ["Netflix"],
    type: "TV Series",
  },
  {
    id: 8,
    title: "Severance",
    image: "/placeholder.svg?height=450&width=300&text=Severance",
    rating: 4.8,
    year: 2022,
    platforms: ["Apple TV+"],
    type: "TV Series",
  },
  {
    id: 9,
    title: "Past Lives",
    image: "/placeholder.svg?height=450&width=300&text=Past+Lives",
    rating: 4.6,
    year: 2023,
    platforms: ["Showtime"],
    type: "Movie",
  },
  {
    id: 10,
    title: "Anatomy of a Fall",
    image: "/placeholder.svg?height=450&width=300&text=Anatomy+of+a+Fall",
    rating: 4.4,
    year: 2023,
    platforms: ["Hulu"],
    type: "Movie",
  },
]

const MOCK_USERS: User[] = [
  {
    id: 1,
    username: "janedoe",
    display_name: "Jane Doe",
    avatar: "/placeholder.svg?height=50&width=50&text=JD",
    followers_count: 156,
    following_count: 89,
    is_following: false,
  },
  {
    id: 2,
    username: "moviefanatic",
    display_name: "Movie Fanatic",
    avatar: "/placeholder.svg?height=50&width=50&text=MF",
    followers_count: 230,
    following_count: 120,
    is_following: true,
  },
  {
    id: 3,
    username: "tvjunkie",
    display_name: "TV Junkie",
    avatar: "/placeholder.svg?height=50&width=50&text=TJ",
    followers_count: 80,
    following_count: 45,
    is_following: false,
  },
  {
    id: 4,
    username: "filmlover",
    display_name: "Film Lover",
    avatar: "/placeholder.svg?height=50&width=50&text=FL",
    followers_count: 300,
    following_count: 200,
    is_following: true,
  },
]

const MOCK_USER_PROFILE: UserProfile = {
  id: 1,
  username: "johndoe",
  display_name: "John Doe",
  avatar: "/placeholder.svg?height=100&width=100&text=JD",
  bio: "Movie enthusiast and TV show binge-watcher. Always looking for the next great story to dive into!",
  followers_count: 156,
  following_count: 89,
  is_following: false,
  favorite_genres: ["Sci-Fi", "Thriller", "Drama", "Comedy"],
  streaming_platforms: ["Netflix", "HBO Max", "Prime Video", "Disney+"],
  watched_content: [
    {
      id: 4,
      title: "Oppenheimer",
      image: "/placeholder.svg?height=450&width=300&text=Oppenheimer",
      rating: 4.7,
      year: 2023,
      platforms: ["Prime Video"],
      watched: true,
    },
    {
      id: 5,
      title: "Poor Things",
      image: "/placeholder.svg?height=450&width=300&text=Poor+Things",
      rating: 4.5,
      year: 2023,
      platforms: ["Hulu"],
      watched: true,
    },
    {
      id: 2,
      title: "The Bear",
      image: "/placeholder.svg?height=450&width=300&text=The+Bear",
      rating: 4.9,
      year: 2023,
      platforms: ["Hulu", "Disney+"],
      watched: true,
    },
  ],
  watchlist_content: [
    {
      id: 1,
      title: "Dune: Part Two",
      image: "/placeholder.svg?height=450&width=300&text=Dune+Part+Two",
      rating: 4.8,
      year: 2024,
      platforms: ["HBO Max", "Prime Video"],
      watched: false,
    },
    {
      id: 7,
      title: "The Gentlemen",
      image: "/placeholder.svg?height=450&width=300&text=The+Gentlemen",
      rating: 4.3,
      year: 2024,
      platforms: ["Netflix"],
      watched: false,
    },
  ],
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const apiService = {
  async getTrendingContent(): Promise<ContentItem[]> {
    await delay(500)
    return MOCK_CONTENT.filter((_, i) => i < 5)
  },

  async getUserWatchlist(): Promise<ContentItem[]> {
    await delay(500)
    return MOCK_USER_PROFILE.watchlist_content
  },

  async getUserWatched(): Promise<ContentItem[]> {
    await delay(500)
    return MOCK_USER_PROFILE.watched_content
  },

  async getRecommendedContent(): Promise<ContentItem[]> {
    await delay(500)
    return MOCK_CONTENT.filter((_, i) => i >= 5)
  },

  async getDiscoverContent(filters: FilterState): Promise<ContentItem[]> {
    await delay(700)
    let filteredContent = MOCK_CONTENT

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredContent = filteredContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.platforms.some((p) => p.toLowerCase().includes(searchTerm)),
      )
    }

    if (filters.contentType !== "all") {
      filteredContent = filteredContent.filter((item) => item.type?.toLowerCase() === filters.contentType.toLowerCase())
    }

    if (filters.platform !== "all") {
      filteredContent = filteredContent.filter((item) =>
        item.platforms.some((p) => p.toLowerCase().includes(filters.platform.toLowerCase())),
      )
    }

    if (filters.genres.length > 0) {
      filteredContent = filteredContent.filter(
        (item) => filters.genres.some((genre) => item.title.toLowerCase().includes(genre.toLowerCase())), // Mock genre filtering
      )
    }

    if (filters.minRating > 0) {
      filteredContent = filteredContent.filter((item) => item.rating >= filters.minRating)
    }

    filteredContent = filteredContent.filter(
      (item) => item.year >= filters.yearRange[0] && item.year <= filters.yearRange[1],
    )

    // Mock platforms and runtime filters (not fully implemented in mock data)
    if (filters.platforms.length > 0) {
      filteredContent = filteredContent.filter((item) => filters.platforms.some((p) => item.platforms.includes(p)))
    }

    return filteredContent
  },

  async getContentById(id: number): Promise<ContentItem> {
    await delay(500)
    const content = MOCK_CONTENT.find((item) => item.id === id)
    if (!content) {
      throw new Error("Content not found")
    }
    return content
  },

  async markAsWatched(contentId: number): Promise<void> {
    await delay(300)
    console.log(`Content ${contentId} marked as watched.`)
    // In a real app, update backend and local state
  },

  async updateWatchedContent(contentId: number, rating: number): Promise<void> {
    await delay(300)
    console.log(`Content ${contentId} updated with rating ${rating}.`)
    // In a real app, update backend and local state
  },

  async addContentToList(contentId: number, listName: string): Promise<void> {
    await delay(300)
    console.log(`Content ${contentId} added to list "${listName}".`)
    // In a real app, update backend and local state
  },

  async createListAndAddContent(listName: string, contentId: number): Promise<void> {
    await delay(300)
    console.log(`New list "${listName}" created and content ${contentId} added.`)
    // In a real app, update backend and local state
  },

  async searchUsers(query: string): Promise<User[]> {
    await delay(500)
    const lowerCaseQuery = query.toLowerCase()
    return MOCK_USERS.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.display_name.toLowerCase().includes(lowerCaseQuery),
    )
  },

  async getFollowers(): Promise<User[]> {
    await delay(500)
    return MOCK_USERS.filter((user) => user.id === 2 || user.id === 4) // Mock followers
  },

  async getFollowing(): Promise<User[]> {
    await delay(500)
    return MOCK_USERS.filter((user) => user.id === 2 || user.id === 4) // Mock following
  },

  async followUser(userId: number): Promise<void> {
    await delay(300)
    console.log(`User ${userId} followed.`)
    // In a real app, update backend and local state
  },

  async unfollowUser(userId: number): Promise<void> {
    await delay(300)
    console.log(`User ${userId} unfollowed.`)
    // In a real app, update backend and local state
  },

  async getUserProfile(userId: number): Promise<UserProfile> {
    await delay(500)
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found")
    }
    // Return a mock profile, potentially adjusting is_following based on current user (mocked as user 1)
    return {
      ...MOCK_USER_PROFILE,
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      avatar: user.avatar,
      is_following: user.id === 2 || user.id === 4, // Mocking current user (ID 1) following these
      followers_count: user.followers_count,
      following_count: user.following_count,
    }
  },
}
