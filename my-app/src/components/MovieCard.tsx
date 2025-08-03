"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Star, Plus, Check, Eye } from "lucide-react"
import { AddToListDialog } from "./AddToListDialog"
import { ComparisonDialog } from "./ComparisonDialog"

interface MovieCardProps {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  watched?: boolean
}

export function MovieCard({ id, title, image, rating, year, platforms, watched = false }: MovieCardProps) {
  const [isWatched, setIsWatched] = useState(watched)
  const [showAddToList, setShowAddToList] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

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

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Link to={`/title/${id}`}>
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant={isWatched ? "secondary" : "default"} onClick={handleMarkAsWatched}>
              {isWatched ? <Check className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {isWatched ? "Watched" : "Mark as Watched"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAddToList(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add to List
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <Link to={`/title/${id}`}>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">{title}</h3>
          </Link>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{year}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {platforms.slice(0, 2).map((platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {platform}
              </Badge>
            ))}
            {platforms.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{platforms.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <AddToListDialog open={showAddToList} onOpenChange={setShowAddToList} contentId={id} contentTitle={title} />

      <ComparisonDialog
        open={showComparison}
        onOpenChange={setShowComparison}
        newContentId={id}
        newContentTitle={title}
        onComplete={handleComparisonComplete}
      />
    </>
  )
}
