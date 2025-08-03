import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DiscoverPage() {
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
                <Input placeholder="Search for movies, TV shows, actors, keywords..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
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
              <Select defaultValue="all">
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
                                <Checkbox id={`genre-${genre}`} />
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
                              <span className="text-sm">Minimum Rating: 3.5</span>
                              <span className="text-sm font-medium">5.0</span>
                            </div>
                            <Slider defaultValue={[3.5]} max={5} step={0.1} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="year">
                        <AccordionTrigger>Release Year</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm">From: 2000</span>
                              <span className="text-sm">To: 2024</span>
                            </div>
                            <Slider defaultValue={[2000, 2024]} min={1900} max={2024} step={1} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="platforms">
                        <AccordionTrigger>Streaming Platforms</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {[
                              "Netflix",
                              "HBO Max",
                              "Disney+",
                              "Prime Video",
                              "Apple TV+",
                              "Hulu",
                              "Peacock",
                              "Paramount+",
                            ].map((platform) => (
                              <div key={platform} className="flex items-center space-x-2">
                                <Checkbox id={`platform-${platform}`} />
                                <label
                                  htmlFor={`platform-${platform}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {platform}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="runtime">
                        <AccordionTrigger>Runtime</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm">From: 30 min</span>
                              <span className="text-sm">To: 180 min</span>
                            </div>
                            <Slider defaultValue={[30, 180]} min={0} max={300} step={5} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="flex justify-between pt-4">
                      <Button variant="outline">Reset</Button>
                      <Button>Apply Filters</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Active Filters</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="flex items-center gap-1 px-3 py-1">
                Genre: Drama
                <button className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Badge className="flex items-center gap-1 px-3 py-1">
                Platform: Netflix
                <button className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Badge className="flex items-center gap-1 px-3 py-1">
                Rating: 4.0+
                <button className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Clear All
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Popular Genres</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Action
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Comedy
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Drama
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Sci-Fi
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Thriller
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Horror
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Romance
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Documentary
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Animation
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Fantasy
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
            </TabsList>

            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select defaultValue="popularity">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="year">Release Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="trending">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <MovieCard
                  title="Dune: Part Two"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2024}
                  platforms={["HBO Max", "Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Bear"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.9}
                  year={2023}
                  platforms={["Hulu", "Disney+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Oppenheimer"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.7}
                  year={2023}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Shogun"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.6}
                  year={2024}
                  platforms={["Hulu", "Disney+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Poor Things"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.5}
                  year={2023}
                  platforms={["Hulu"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Gentlemen"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.3}
                  year={2024}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Fallout"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.5}
                  year={2024}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Challengers"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.4}
                  year={2024}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Regime"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.2}
                  year={2024}
                  platforms={["HBO Max"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Ripley"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.5}
                  year={2024}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <MovieCard
                  title="Challengers"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.4}
                  year={2024}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Fallout"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.5}
                  year={2024}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Gentlemen"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.3}
                  year={2024}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Civil War"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.1}
                  year={2024}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Shogun"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.6}
                  year={2024}
                  platforms={["Hulu", "Disney+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Regime"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.2}
                  year={2024}
                  platforms={["HBO Max"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Ripley"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.5}
                  year={2024}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="3 Body Problem"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.2}
                  year={2024}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Dune: Part Two"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2024}
                  platforms={["HBO Max", "Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Godzilla x Kong"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.0}
                  year={2024}
                  platforms={["HBO Max"]}
                  withAddToList={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="top">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <MovieCard
                  title="The Bear"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.9}
                  year={2023}
                  platforms={["Hulu", "Disney+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Succession"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.9}
                  year={2023}
                  platforms={["HBO Max"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Parasite"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.9}
                  year={2019}
                  platforms={["Hulu"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Breaking Bad"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.9}
                  year={2013}
                  platforms={["Netflix"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="The Last of Us"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2023}
                  platforms={["HBO Max"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Ted Lasso"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2023}
                  platforms={["Apple TV+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Dune: Part Two"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2024}
                  platforms={["HBO Max", "Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Severance"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.8}
                  year={2022}
                  platforms={["Apple TV+"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Everything Everywhere All at Once"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.7}
                  year={2022}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
                <MovieCard
                  title="Oppenheimer"
                  image="/placeholder.svg?height=450&width=300"
                  rating={4.7}
                  year={2023}
                  platforms={["Prime Video"]}
                  withAddToList={true}
                />
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
