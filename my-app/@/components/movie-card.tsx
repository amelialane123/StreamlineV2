"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle, Clock, Plus, Star } from "lucide-react"
import { AddToListDialog } from "@/components/add-to-list-dialog"
import { ComparisonDialog } from "@/components/comparison-dialog"
import { useState } from "react"

interface MovieCardProps {
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
  watched?: boolean
  withAddToList?: boolean
}

export function MovieCard({
  title,
  image,
  rating,
  year,
  platforms,
  watched = false,
  withAddToList = false,
}: MovieCardProps) {
  const [showComparisonDialog, setShowComparisonDialog] = useState(false)

  const handleMarkAsWatched = () => {
    if (!watched) {
      setShowComparisonDialog(true)
    }
  }

  return (
    <Card className="overflow-hidden w-[220px]">
      <div className="relative">
        <Link href={`/title/${title.toLowerCase().replace(/\s+/g, "-")}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={220}
            height={330}
            className="object-cover aspect-[2/3]"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white border-0 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {rating}
          </Badge>
        </div>
        {watched && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-600/90 text-white border-0">Watched</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="font-medium line-clamp-1">{title}</div>
        <div className="text-xs text-muted-foreground">{year}</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {platforms.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs px-1 py-0">
              {platform}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button size="sm" className="flex-1" variant={watched ? "outline" : "default"} onClick={handleMarkAsWatched}>
          {watched ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" /> Watched
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-1" /> Watch
            </>
          )}
        </Button>
        {withAddToList && (
          <AddToListDialog title={title} image={image} rating={rating} year={year} platforms={platforms}>
            <Button size="sm" variant="outline" className="px-2 bg-transparent">
              <Plus className="h-4 w-4" />
            </Button>
          </AddToListDialog>
        )}
      </CardFooter>

      {/* Comparison Dialog */}
      <ComparisonDialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
        newContent={{
          title,
          image,
          rating,
          year,
          platforms,
        }}
      />
    </Card>
  )
}
