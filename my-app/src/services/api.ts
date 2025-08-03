const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

interface ContentItem {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  watched?: boolean
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

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("authToken")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("API request failed:", error)
      // Return mock data for development
      return this.getMockData(endpoint) as T
    }
  }

  private getMockData(endpoint: string): any {
    // Mock data for development when API is not available
    const mockContent: ContentItem[] = [
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
      {
        id: 3,
        title: "Oppenheimer",
        image: "/placeholder.svg?height=450&width=300",
        rating: 4.7,
        year: 2023,
        platforms: ["Prime Video"],
      },
    ]

    if (endpoint.includes("/trending/") || endpoint.includes("/discover/") || endpoint.includes("/recommendations/")) {
      return mockContent
    }

    if (endpoint.includes("/watchlist/") || endpoint.includes("/watched/")) {
      return mockContent.slice(0, 2)
    }

    if (endpoint.includes("/lists/")) {
      return [
        { id: 1, name: "Must Watch", content_count: 5 },
        { id: 2, name: "Sci-Fi Favorites", content_count: 3 },
      ]
    }

    if (endpoint.includes("/comparisons/")) {
      return mockContent.slice(1, 3)
    }

    return []
  }

  // Content endpoints
  async getTrendingContent(): Promise<ContentItem[]> {
    return this.request<ContentItem[]>("/content/trending/")
  }

  async getDiscoverContent(filters: FilterState): Promise<ContentItem[]> {
    const params = new URLSearchParams()

    if (filters.search) params.append("search", filters.search)
    if (filters.contentType !== "all") params.append("content_type", filters.contentType)
    if (filters.platform !== "all") params.append("platform", filters.platform)
    if (filters.genres.length > 0) params.append("genres", filters.genres.join(","))
    if (filters.minRating > 3.5) params.append("min_rating", filters.minRating.toString())

    return this.request<ContentItem[]>(`/content/discover/?${params.toString()}`)
  }

  async getContentById(id: number): Promise<ContentItem> {
    return this.request<ContentItem>(`/content/${id}/`)
  }

  // User watchlist endpoints
  async getUserWatchlist(): Promise<ContentItem[]> {
    return this.request<ContentItem[]>("/user/watchlist/")
  }

  async getUserWatched(): Promise<ContentItem[]> {
    return this.request<ContentItem[]>("/user/watched/")
  }

  async getRecommendedContent(): Promise<ContentItem[]> {
    return this.request<ContentItem[]>("/user/recommendations/")
  }

  // List management
  async addToList(contentId: number, listName: string): Promise<void> {
    return this.request("/user/lists/add/", {
      method: "POST",
      body: JSON.stringify({
        content_id: contentId,
        list_name: listName,
      }),
    })
  }

  async createList(listName: string): Promise<void> {
    return this.request("/user/lists/", {
      method: "POST",
      body: JSON.stringify({
        name: listName,
      }),
    })
  }

  async getUserLists(): Promise<Array<{ id: number; name: string; content_count: number }>> {
    return this.request("/user/lists/")
  }

  // Watched content and comparisons
  async markAsWatched(contentId: number): Promise<void> {
    return this.request("/user/watched/", {
      method: "POST",
      body: JSON.stringify({
        content_id: contentId,
      }),
    })
  }

  async getComparisonContent(contentId: number): Promise<ContentItem[]> {
    return this.request<ContentItem[]>(`/user/comparisons/${contentId}/`)
  }

  async submitComparison(
    newContentId: number,
    existingContentId: number,
    preferred: "new" | "existing",
  ): Promise<void> {
    return this.request("/user/comparisons/", {
      method: "POST",
      body: JSON.stringify({
        new_content_id: newContentId,
        existing_content_id: existingContentId,
        preferred,
      }),
    })
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    localStorage.setItem("authToken", response.token)
    return response
  }

  async register(email: string, password: string, username: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    })

    localStorage.setItem("authToken", response.token)
    return response
  }

  async logout(): Promise<void> {
    localStorage.removeItem("authToken")
    return this.request("/auth/logout/", {
      method: "POST",
    })
  }
}

export const apiService = new ApiService()
