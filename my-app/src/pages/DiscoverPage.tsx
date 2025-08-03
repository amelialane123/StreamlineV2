"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "../components/SiteHeader"
import { MovieCard } from "../components/MovieCard"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { Slider } from "../components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Badge } from "../components/ui/badge"
import { Search, Filter, X } from "lucide-react"
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

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
]

const PLATFORMS = [
  "Netflix",
  "HBO Max",
  "Prime Video",
  "Disney+",
  "Hulu",
  "Apple TV+",
  "Paramount+",
  "Peacock",
  "Showtime",
  "Starz",
]

export default function DiscoverPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    contentType: "all",
    platform: "all",
    genres: [],
    minRating: 0,
    yearRange: [1990, 2024],
    platforms: [],
    runtimeRange: [0, 300],
  })

  useEffect(() => {
    fetchContent()
  }, [filters])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const results = await apiService.getDiscoverContent(filters)
      setContent(results)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleGenre = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }))
  }

  const togglePlatform = (platform: string) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      contentType: "all",
      platform: "all",
      genres: [],
      minRating: 0,
      yearRange: [1990, 2024],
      platforms: [],
      runtimeRange: [0, 300],
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.contentType !== "all" ? filters.contentType : null,
    filters.platform !== "all" ? filters.platform : null,
    filters.genres.length > 0 ? "genres" : null,
    filters.minRating > 0 ? "rating" : null,
    filters.yearRange[0] !== 1990 || filters.yearRange[1] !== 2024 ? "year" : null,
    filters.platforms.length > 0 ? "platforms" : null,
    filters.runtimeRange[0] !== 0 || filters.runtimeRange[1] !== 300 ? "runtime" : null,
  ].filter(Boolean).length

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">Find your next favorite movie or TV show</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                      {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                        <X className="h-4 w-4" />
                        Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search titles..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* Content Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <Select value={filters.contentType} onValueChange={(value) => updateFilter("contentType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="movie">Movies</SelectItem>
                        <SelectItem value="tv">TV Shows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Advanced Filters */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="genres">
                      <AccordionTrigger className="text-sm font-medium">
                        Genres
                        {filters.genres.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {filters.genres.length}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {GENRES.map((genre) => (
                            <div key={genre} className="flex items-center space-x-2">
                              <Checkbox
                                id={genre}
                                checked={filters.genres.includes(genre)}
                                onCheckedChange={() => toggleGenre(genre)}
                              />
                              <label
                                htmlFor={genre}
                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {genre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rating">
                      <AccordionTrigger className="text-sm font-medium">
                        Minimum Rating
                        {filters.minRating > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {filters.minRating}+
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <Slider
                            value={[filters.minRating]}
                            onValueChange={([value]) => updateFilter("minRating", value)}
                            max={5}
                            min={0}
                            step={0.5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>5</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="year">
                      <AccordionTrigger className="text-sm font-medium">
                        Release Year
                        {(filters.yearRange[0] !== 1990 || filters.yearRange[1] !== 2024) && (
                          <Badge variant="secondary" className="ml-2">
                            {filters.yearRange[0]}-{filters.yearRange[1]}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <Slider
                            value={filters.yearRange}
                            onValueChange={(value) => updateFilter("yearRange", value as [number, number])}
                            max={2024}
                            min={1990}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1990</span>
                            <span>2024</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="platforms">
                      <AccordionTrigger className="text-sm font-medium">
                        Streaming Platforms
                        {filters.platforms.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {filters.platforms.length}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {PLATFORMS.map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={platform}
                                checked={filters.platforms.includes(platform)}
                                onCheckedChange={() => togglePlatform(platform)}
                              />
                              <label
                                htmlFor={platform}
                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {platform}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading content...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">{content.length} results found</h2>
                  </div>

                  {content.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {content.map((item) => (
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
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                      <Button onClick={clearFilters}>Clear All Filters</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
