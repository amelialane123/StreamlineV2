"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { PlusCircle, ListPlus } from "lucide-react"
import { apiService } from "../services/api"
import { useToast } from "./ui/use-toast"

interface AddToListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: number
  contentTitle: string
}

export function AddToListDialog({ open, onOpenChange, contentId, contentTitle }: AddToListDialogProps) {
  const [lists, setLists] = useState<Array<{ id: number; name: string; content_count: number }>>([])
  const [newListName, setNewListName] = useState("")
  const [selectedList, setSelectedList] = useState<string | null>(null) // This would typically be a list ID
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchLists()
    }
  }, [open])

  const fetchLists = async () => {
    try {
      const userLists = await apiService.getUserLists()
      setLists(userLists)
    } catch (error) {
      console.error("Error fetching lists:", error)
    }
  }

  const handleAddToList = async () => {
    if (!selectedList && !newListName.trim()) return

    setLoading(true)
    try {
      if (selectedList) {
        // Add to existing list
        await apiService.addContentToList(contentId, selectedList)
      } else if (newListName.trim()) {
        // Create new list and add content
        await apiService.createListAndAddContent(newListName, contentId)
      }
      toast({
        title: "Success!",
        description: `"${contentTitle}" added to list`,
      })
      onOpenChange(false)
      setNewListName("")
      setSelectedList(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to list. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding to list:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add "{contentTitle}" to a list</DialogTitle>
          <DialogDescription>Select an existing list or create a new one.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* This section would dynamically load user's existing lists */}
          <div className="grid gap-2">
            <Label htmlFor="existing-list">Existing Lists</Label>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {lists.map((list) => (
                <Button
                  key={list.id}
                  variant={selectedList === list.id.toString() ? "default" : "outline"}
                  onClick={() => setSelectedList(list.id.toString())}
                  className="justify-start"
                >
                  {list.name} ({list.content_count} items)
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-list">Create New List</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="new-list"
                placeholder="New list name"
                value={newListName}
                onChange={(e) => {
                  setNewListName(e.target.value)
                  setSelectedList(null) // Deselect existing list if typing new one
                }}
              />
              <Button
                variant="outline"
                size="icon"
                disabled={!newListName.trim()}
                onClick={() => setSelectedList(null)} // Ensure no existing list is selected
              >
                <ListPlus className="h-4 w-4" />
                <span className="sr-only">Create new list</span>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToList} disabled={loading || (!selectedList && !newListName.trim())}>
            {loading ? (
              "Adding..."
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add to List
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
