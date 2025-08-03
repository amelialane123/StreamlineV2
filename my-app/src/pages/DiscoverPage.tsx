"use client"

import { SiteHeader } from "../components/SiteHeader"
import { MovieCard } from "../components/MovieCard"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Slider } from "../components/ui/slider"
import { Checkbox } from "../components/ui/checkbox"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
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

export default function DiscoverPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    contentType: "all",
    platform: "all",
    genres: [],
    minRating: 3.5,
    yearRange: [2000, 2024],
    platforms: [],
    runtimeRange: [30, 180],
  })

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const data = await apiService.getDiscoverContent(filters)
        setContent(data)
      } catch (error) {
        console.error("Error fetching content:", error)
        // Set mock data for development
        setContent([
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
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [filters])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      contentType: "all",
      platform: "all",
      genres: [],
      minRating: 3.5,
      yearRange: [2000, 2024],
      platforms: [],
      runtimeRange: [30, 180],
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl mb-6">Discover</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for movies, TV shows, actors, keywords..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.contentType} onValueChange={(value) => handleFilterChange("contentType", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="movies">Movies</SelectItem>
                  <SelectItem value="shows">TV Shows</SelectItem>
                  <SelectItem value="documentaries">Documentaries</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.platform} onValueChange={(value) => handleFilterChange("platform", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="hbo">HBO Max</SelectItem>
                  <SelectItem value="disney">Disney+</SelectItem>
                  <SelectItem value="prime">Prime Video</SelectItem>
                  <SelectItem value="apple">Apple TV+</SelectItem>
                  <SelectItem value="hulu">Hulu</SelectItem>
                </SelectContent>
              </Select>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>Refine your search with advanced filters</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="genres">
                        <AccordionTrigger>Genres</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Action",
                              "Comedy",
                              "Drama",
                              "Sci-Fi",
                              "Thriller",
                              "Horror",
                              "Romance",
                              "Documentary",
                              "Animation",
                              "Fantasy",
                              "Adventure",
                              "Crime",
                              "Mystery",
                              "Family",
                            ].map((genre) => (
                              <div key={genre} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`genre-${genre}`}
                                  checked={filters.genres.includes(genre)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleFilterChange("genres", [...filters.genres, genre])
                                    } else {
                                      handleFilterChange(
                                        "genres",
                                        filters.genres.filter((g) => g !== genre),
                                      )
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`genre-${genre}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {genre}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="rating">
                        <AccordionTrigger>Rating</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm">Minimum Rating: {filters.minRating}</span>
                              <span className="text-sm font-medium">5.0</span>
                            </div>
                            <Slider
                              value={[filters.minRating]}
                              max={5}
                              step={0.1}
                              onValueChange={(value) => handleFilterChange("minRating", value[0])}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={clearFilters}>
                        Reset
                      </Button>
                      <Button>Apply Filters</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {content.map((item) => (
                    <MovieCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      image={item.image}
                      rating={item.rating}
                      year={item.year}
                      platforms={item.platforms}
                      withAddToList={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {content.map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    rating={item.rating}
                    year={item.year}
                    platforms={item.platforms}
                    withAddToList={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {content.map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    rating={item.rating}
                    year={item.year}
                    platforms={item.platforms}
                    withAddToList={true}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button>Load More</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
