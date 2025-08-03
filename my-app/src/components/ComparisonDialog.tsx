"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import { Star, Check } from "lucide-react"
import { apiService } from "../services/api"

interface ComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newContentId: number
  newContentTitle: string
  onComplete: () => void
}

export function ComparisonDialog({
  open,
  onOpenChange,
  newContentId,
  newContentTitle,
  onComplete,
}: ComparisonDialogProps) {
  const [rating, setRating] = useState(3.5)
  const [comparisonContent, setComparisonContent] = useState<any[]>([]) // This would be fetched from API

  // Mock data for comparison
  const mockComparisonContent = [
    { id: 101, title: "Old Favorite Movie", rating: 4.5 },
    { id: 102, title: "Another Great Show", rating: 4.0 },
  ]

  const handleSave = async () => {
    try {
      await apiService.updateWatchedContent(newContentId, rating)
      onComplete()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving watched content:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark "{newContentTitle}" as Watched</DialogTitle>
          <DialogDescription>Rate this content and compare it with others you've seen.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="flex items-center gap-2">
              Your Rating: <span className="font-bold text-lg">{rating.toFixed(1)}</span>{" "}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </Label>
            <Slider
              id="rating"
              min={0.5}
              max={5}
              step={0.5}
              value={[rating]}
              onValueChange={(value) => setRating(value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Compare with...</Label>
            <div className="grid gap-2">
              {mockComparisonContent.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {item.rating}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Compare
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
