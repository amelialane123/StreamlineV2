"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Star, ChevronRight } from "lucide-react"
import { Progress } from "./ui/progress"
import { apiService } from "../services/api"

interface ContentItem {
  id: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
}

interface ComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newContent: ContentItem
  onComplete: () => void
}

export function ComparisonDialog({ open, onOpenChange, newContent, onComplete }: ComparisonDialogProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [progress, setProgress] = useState(0)
  const [existingContent, setExistingContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      const fetchComparisonContent = async () => {
        try {
          setLoading(true)
          const content = await apiService.getComparisonContent(newContent.id)
          setExistingContent(content)
          setCurrentRound(0)
          setProgress(0)
        } catch (error) {
          console.error("Error fetching comparison content:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchComparisonContent()
    }
  }, [open, newContent.id])

  const totalRounds = Math.min(3, existingContent.length)

  const handleSelection = async (selected: "left" | "right") => {
    try {
      const existingContentId = existingContent[currentRound].id
      const preferred = selected === "left" ? "new" : "existing"

      await apiService.submitComparison(newContent.id, existingContentId, preferred)

      // Move to next round or finish
      if (currentRound < totalRounds - 1) {
        setCurrentRound(currentRound + 1)
        setProgress(((currentRound + 1) / totalRounds) * 100)
      } else {
        // Final round completed
        onComplete()
        onOpenChange(false)
        // Reset for next time
        setTimeout(() => {
          setCurrentRound(0)
          setProgress(0)
        }, 300)
      }
    } catch (error) {
      console.error("Error submitting comparison:", error)
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (existingContent.length === 0) {
    // No content to compare with, just mark as watched
    onComplete()
    onOpenChange(false)
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Compare Content</DialogTitle>
          <DialogDescription>Which did you enjoy more? This helps us rank your watched content.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Round {currentRound + 1} of {totalRounds}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left side - New content */}
          <div className="flex flex-col items-center">
            <div className="relative w-[180px] mb-4">
              <img
                src={newContent.image || "/placeholder.svg"}
                alt={newContent.title}
                className="w-full h-[270px] rounded-md object-cover aspect-[2/3]"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-black/70 text-white border-0 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {newContent.rating}
                </Badge>
              </div>
            </div>
            <h3 className="font-medium text-lg text-center">{newContent.title}</h3>
            <p className="text-sm text-muted-foreground">{newContent.year}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {newContent.platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => handleSelection("left")}>
              I preferred this
            </Button>
          </div>

          {/* Right side - Existing content */}
          {currentRound < existingContent.length && (
            <div className="flex flex-col items-center">
              <div className="relative w-[180px] mb-4">
                <img
                  src={existingContent[currentRound].image || "/placeholder.svg"}
                  alt={existingContent[currentRound].title}
                  className="w-full h-[270px] rounded-md object-cover aspect-[2/3]"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white border-0 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {existingContent[currentRound].rating}
                  </Badge>
                </div>
              </div>
              <h3 className="font-medium text-lg text-center">{existingContent[currentRound].title}</h3>
              <p className="text-sm text-muted-foreground">{existingContent[currentRound].year}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {existingContent[currentRound].platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => handleSelection("right")}>
                I preferred this
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center mt-2">
          <span className="text-sm text-muted-foreground">Can't decide? </span>
          <Button variant="link" size="sm" className="h-auto p-0 ml-1" onClick={() => handleSelection("right")}>
            Skip this comparison <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
