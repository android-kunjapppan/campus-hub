"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CreatePostProps {
  userProfile: {
    full_name: string
    avatar_url: string | null
  } | null
}

export function CreatePost({ userProfile }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      const { error } = await supabase.from("posts").insert({
        author_id: user.id,
        content,
        image_url: imageUrl || null,
      })

      if (error) throw error

      setContent("")
      setImageUrl("")
      setShowImageInput(false)
      router.refresh()
    } catch (error) {
      console.error("[] Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.avatar_url || undefined} />
              <AvatarFallback className="bg-amber-100 text-amber-700">
                {userProfile ? getInitials(userProfile.full_name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share something with your network..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
              />

              {showImageInput && (
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-muted-foreground"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {showImageInput ? "Remove" : "Add"} Image
                </Button>
                <Button
                  type="submit"
                  disabled={!content.trim() || isLoading}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
