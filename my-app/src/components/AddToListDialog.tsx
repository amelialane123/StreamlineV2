"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { PlusCircle } from "lucide-react"
import { apiService } from "../services/api"
import { useToast } from "./ui/use-toast"

interface AddToListDialogProps {
  children: React.ReactNode
  contentId: number
  title: string
  image: string
  rating: number
  year: number
  platforms: string[]
}

export function AddToListDialog({ children, contentId, title }: AddToListDialogProps) {
  const [selectedList, setSelectedList] = useState("")
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [userLists, setUserLists] = useState<Array<{ id: number; name: string; content_count: number }>>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const lists = await apiService.getUserLists()
        setUserLists(lists)
      } catch (error) {
        console.error("Error fetching user lists:", error)
      }
    }

    fetchUserLists()
  }, [])

  const handleAddToList = async () => {
    setLoading(true)
    try {
      if (showNewListInput && newListName) {
        await apiService.createList(newListName)
        await apiService.addToList(contentId, newListName)
        toast({
          title: "Success",
          description: `"${title}" added to new list "${newListName}"`,
        })
      } else if (selectedList) {
        await apiService.addToList(contentId, selectedList)
        toast({
          title: "Success",
          description: `"${title}" added to list`,
        })
      }

      // Reset form
      setSelectedList("")
      setNewListName("")
      setShowNewListInput(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
                  {userLists.map((list) => (
                    <SelectItem key={list.id} value={list.name}>
                      {list.name} ({list.content_count} items)
                    </SelectItem>
                  ))}
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
          <Button type="submit" onClick={handleAddToList} disabled={loading || (!selectedList && !newListName)}>
            {loading ? "Adding..." : `Add to ${showNewListInput ? "New List" : "List"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
