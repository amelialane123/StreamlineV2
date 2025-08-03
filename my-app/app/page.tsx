import Link from "next/link"
import { Search, TrendingUp, Clock, CheckCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MovieCard } from "@/components/movie-card"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Welcome to WatchTracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Your one-stop shop to track shows and movies across all streaming platforms.
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search for movies and shows..." />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="container pb-8">
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="watchlist">Your Watchlist</TabsTrigger>
              <TabsTrigger value="watched">Recently Watched</TabsTrigger>
            </TabsList>
            <TabsContent value="trending" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Trending Now
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/discover">View all</Link>
                </Button>
              </div>
              <ScrollArea className="w-full whitespace-nowrap pb-6">
                <div className="flex w-max space-x-4 p-1">
                  <MovieCard
                    title="Dune: Part Two"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.8}
                    year={2024}
                    platforms={["HBO Max", "Prime Video"]}
                  />
                  <MovieCard
                    title="The Bear"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.9}
                    year={2023}
                    platforms={["Hulu", "Disney+"]}
                  />
                  <MovieCard
                    title="Oppenheimer"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.7}
                    year={2023}
                    platforms={["Prime Video"]}
                  />
                  <MovieCard
                    title="Shogun"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.6}
                    year={2024}
                    platforms={["Hulu", "Disney+"]}
                  />
                  <MovieCard
                    title="Poor Things"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.5}
                    year={2023}
                    platforms={["Hulu"]}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="watchlist" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Your Watchlist
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile/watchlist">Manage lists</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Must Watch</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>The Gentlemen</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>Fallout</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>Challengers</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Sci-Fi Favorites</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>Foundation</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>Severance</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>3 Body Problem</span>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
                  <Button variant="ghost" className="h-full w-full flex flex-col gap-2">
                    <Plus className="h-8 w-8" />
                    <span>Create New List</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="watched" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Recently Watched
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile/history">View all</Link>
                </Button>
              </div>
              <ScrollArea className="w-full whitespace-nowrap pb-6">
                <div className="flex w-max space-x-4 p-1">
                  <MovieCard
                    title="The Regime"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.2}
                    year={2024}
                    platforms={["HBO Max"]}
                    watched={true}
                  />
                  <MovieCard
                    title="Ripley"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.5}
                    year={2024}
                    platforms={["Netflix"]}
                    watched={true}
                  />
                  <MovieCard
                    title="Saltburn"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.1}
                    year={2023}
                    platforms={["Prime Video"]}
                    watched={true}
                  />
                  <MovieCard
                    title="The Last of Us"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.8}
                    year={2023}
                    platforms={["HBO Max"]}
                    watched={true}
                  />
                  <MovieCard
                    title="Killers of the Flower Moon"
                    image="/placeholder.svg?height=450&width=300"
                    rating={4.4}
                    year={2023}
                    platforms={["Apple TV+"]}
                    watched={true}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </section>

        <section className="container pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/discover">More recommendations</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <MovieCard
              title="Slow Horses"
              image="/placeholder.svg?height=450&width=300"
              rating={4.7}
              year={2023}
              platforms={["Apple TV+"]}
            />
            <MovieCard
              title="Bridgerton"
              image="/placeholder.svg?height=450&width=300"
              rating={4.3}
              year={2023}
              platforms={["Netflix"]}
            />
            <MovieCard
              title="The Boys"
              image="/placeholder.svg?height=450&width=300"
              rating={4.6}
              year={2023}
              platforms={["Prime Video"]}
            />
            <MovieCard
              title="Succession"
              image="/placeholder.svg?height=450&width=300"
              rating={4.9}
              year={2023}
              platforms={["HBO Max"]}
            />
            <MovieCard
              title="Ted Lasso"
              image="/placeholder.svg?height=450&width=300"
              rating={4.8}
              year={2023}
              platforms={["Apple TV+"]}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
