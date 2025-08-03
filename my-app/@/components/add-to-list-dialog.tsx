"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

interface AddToListDialogProps {
  children: React.ReactNode
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
}

export function AddToListDialog({ children, title, image, rating, year, platforms }: AddToListDialogProps) {
  const [selectedList, setSelectedList] = useState("")
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [newListName, setNewListName] = useState("")

  const handleAddToList = () => {
    // Here you would implement the logic to add the content to the selected list
    console.log(`Adding ${title} to list: ${selectedList || newListName}`)
    // After adding, close the dialog
    return true
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
          <DialogDescription>Add "{title}" to one of your lists or create a new list.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!showNewListInput ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list" className="text-right">
                List
              </Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="must-watch">Must Watch</SelectItem>
                  <SelectItem value="sci-fi-favorites">Sci-Fi Favorites</SelectItem>
                  <SelectItem value="oscar-winners">Oscar Winners</SelectItem>
                  <SelectItem value="new-list" onClick={() => setShowNewListInput(true)}>
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Create New List</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-list" className="text-right">
                New List
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-list"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {showNewListInput && (
            <Button variant="outline" onClick={() => setShowNewListInput(false)} className="mr-auto">
              Back to Lists
            </Button>
          )}
          <Button type="submit" onClick={handleAddToList}>
            Add to {showNewListInput ? "New List" : "List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
