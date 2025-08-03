import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MovieCard } from "@/components/movie-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Star, Share2, Heart, MessageSquare, CheckCircle, Calendar, Film, Tv2 } from "lucide-react"

export default function TitlePage({ params }: { params: { slug: string } }) {
  // This would normally fetch data based on the slug
  const isShow = params.slug.includes("bear") || params.slug.includes("shogun")

  const title = isShow ? "The Bear" : "Dune: Part Two"
  const year = isShow ? 2023 : 2024
  const rating = isShow ? 4.9 : 4.8
  const platforms = isShow ? ["Hulu", "Disney+"] : ["HBO Max", "Prime Video"]
  const image = isShow ? "/placeholder.svg?height=600&width=400" : "/placeholder.svg?height=600&width=400"
  const backdrop = isShow ? "/placeholder.svg?height=600&width=1200" : "/placeholder.svg?height=600&width=1200"
  const type = isShow ? "TV Series" : "Movie"
  const runtime = isShow ? "30 min/episode" : "166 min"
  const seasons = isShow ? 2 : null
  const episodes = isShow ? 18 : null
  const director = isShow ? "Christopher Storer" : "Denis Villeneuve"
  const cast = isShow
    ? ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"]
    : ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"]
  const genres = isShow ? ["Comedy", "Drama"] : ["Sci-Fi", "Adventure", "Drama"]
  const description = isShow
    ? "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after the suicide of his brother. As he fights to transform the restaurant and himself, his kitchen staff become his new family."
    : "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee."

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={backdrop || "/placeholder.svg"}
            alt={`${title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
          <div className="container relative h-full flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="hidden md:block w-64 rounded-md overflow-hidden shadow-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  width={256}
                  height={384}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {year}
                    </Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {rating}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
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
                    <span>{year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isShow ? (
                      <Tv2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Film className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{runtime}</span>
                  </div>
                  {isShow && (
                    <div className="flex items-center gap-2">
                      <span>
                        {seasons} {seasons === 1 ? "Season" : "Seasons"}
                      </span>
                      <span>•</span>
                      <span>
                        {episodes} {episodes === 1 ? "Episode" : "Episodes"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Available on</h3>
                  <div className="flex gap-2">
                    {platforms.map((platform) => (
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
              <Image src={image || "/placeholder.svg"} alt={title} width={192} height={288} className="object-cover" />
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
                <p className="text-muted-foreground">{description}</p>
              </div>

              {isShow && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Seasons</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Season 2 (2023)</h3>
                        <Badge>10 Episodes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Carmy, Sydney and the crew of The Bear work to transform their sandwich shop into a fine dining
                        establishment.
                      </p>
                      <Button variant="outline" size="sm">
                        View Episodes
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Season 1 (2022)</h3>
                        <Badge>8 Episodes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.
                      </p>
                      <Button variant="outline" size="sm">
                        View Episodes
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Similar Titles</h2>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-6">
                  <div className="flex w-max space-x-4 p-1">
                    {isShow ? (
                      <>
                        <MovieCard
                          title="Shogun"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.6}
                          year={2024}
                          platforms={["Hulu", "Disney+"]}
                        />
                        <MovieCard
                          title="The Gentlemen"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.3}
                          year={2024}
                          platforms={["Netflix"]}
                        />
                        <MovieCard
                          title="Severance"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.8}
                          year={2022}
                          platforms={["Apple TV+"]}
                        />
                        <MovieCard
                          title="Succession"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.9}
                          year={2023}
                          platforms={["HBO Max"]}
                        />
                      </>
                    ) : (
                      <>
                        <MovieCard
                          title="Oppenheimer"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.7}
                          year={2023}
                          platforms={["Prime Video"]}
                        />
                        <MovieCard
                          title="Blade Runner 2049"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.5}
                          year={2017}
                          platforms={["HBO Max"]}
                        />
                        <MovieCard
                          title="Arrival"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.6}
                          year={2016}
                          platforms={["Netflix"]}
                        />
                        <MovieCard
                          title="Foundation"
                          image="/placeholder.svg?height=450&width=300"
                          rating={4.6}
                          year={2023}
                          platforms={["Apple TV+"]}
                        />
                      </>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="cast" className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {cast.map((actor, index) => (
                    <div key={actor} className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-2">
                        <AvatarImage src={`/placeholder.svg?height=100&width=100&query=${actor} actor`} alt={actor} />
                        <AvatarFallback>
                          {actor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{actor}</div>
                      <div className="text-xs text-muted-foreground">
                        {isShow
                          ? ["Carmen Berzatto", "Sydney Adamu", "Richard Jerimovich", "Marcus Brooks"][index]
                          : ["Paul Atreides", "Chani", "Lady Jessica", "Gurney Halleck"][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Crew</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Director</div>
                    <div>{director}</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Writer</div>
                    <div>{isShow ? "Christopher Storer, Joanna Calo" : "Denis Villeneuve, Jon Spaihts"}</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">Producer</div>
                    <div>{isShow ? "Josh Senior, Matty Matheson" : "Mary Parent, Cale Boyter"}</div>
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
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-sm">
                      {isShow
                        ? "This show is absolutely incredible. The attention to detail in the kitchen scenes is unmatched, and the character development is phenomenal. Jeremy Allen White deserves all the awards for his portrayal of Carmy."
                        : "A visual masterpiece that expands on the first film in every way. The world-building is incredible, and the performances, especially from Timothée Chalamet and Zendaya, are outstanding. Denis Villeneuve has created a sci-fi epic for the ages."}
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

                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="User" />
                          <AvatarFallback>CL</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">CinemaLover</div>
                          <div className="text-xs text-muted-foreground">March 10, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-sm">
                      {isShow
                        ? "Season 2 takes everything that made the first season great and elevates it. The episode 'Fishes' is one of the best episodes of television I've ever seen. The tension in the kitchen scenes is palpable."
                        : "While the visuals are stunning and the performances strong, I felt the pacing was a bit off in the middle section. Still, it's a worthy sequel that expands the universe in interesting ways."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Heart className="h-4 w-4" />
                        87
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=50&width=50" alt="User" />
                          <AvatarFallback>SF</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">SciFiFan</div>
                          <div className="text-xs text-muted-foreground">March 5, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-sm">
                      {isShow
                        ? "The writing on this show is impeccable. Every character feels fully realized and the kitchen dynamics are so authentic. As someone who worked in restaurants, I can say they really nailed the atmosphere."
                        : "This is how you do a sequel. The world of Arrakis feels even more immersive, and the sandworm sequences are breathtaking. The score by Hans Zimmer is also phenomenal and adds so much to the experience."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Heart className="h-4 w-4" />
                        56
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
