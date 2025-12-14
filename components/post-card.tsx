"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Post {
  id: string
  content: string
  image_url: string | null
  created_at: string
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
    university: string
    department: string
  }
  post_likes: Array<{ count: number }>
  post_comments: Array<{ count: number }>
}

interface PostCardProps {
  post: Post
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.post_likes?.[0]?.count || 0)
  const [commentsCount, setCommentsCount] = useState(post.post_comments?.[0]?.count || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Array<any>>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    const supabase = createClient()

    if (isLiked) {
      // Unlike
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      setIsLiked(false)
      setLikesCount((prev) => Math.max(0, prev - 1))
    } else {
      // Like
      await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id: currentUserId,
      })
      setIsLiked(true)
      setLikesCount((prev) => prev + 1)
    }
  }

  const loadComments = async () => {
    if (comments.length > 0) return

    setIsLoadingComments(true)
    const supabase = createClient()

    const { data } = await supabase
      .from("post_comments")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `,
      )
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })

    if (data) {
      setComments(data)
    }
    setIsLoadingComments(false)
  }

  const handleComment = async () => {
    if (!commentText.trim()) return

    const supabase = createClient()

    const { error } = await supabase.from("post_comments").insert({
      post_id: post.id,
      user_id: currentUserId,
      content: commentText,
    })

    if (!error) {
      setCommentText("")
      setCommentsCount((prev) => prev + 1)
      loadComments()
      router.refresh()
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
    if (!showComments) {
      loadComments()
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
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles.avatar_url || undefined} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {getInitials(post.profiles.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.profiles.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {post.profiles.department} • {post.profiles.university}
            </p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at))} ago</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>

        {post.image_url && (
          <div className="mt-4 overflow-hidden rounded-lg">
            <img src={post.image_url || "/placeholder.svg"} alt="Post content" className="w-full object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-1 border-t pt-3">
          <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {likesCount > 0 && likesCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleComments}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {commentsCount > 0 && commentsCount}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-4 mb-4">
              {isLoadingComments ? (
                <p className="text-sm text-muted-foreground">Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gray-100 text-xs">
                        {getInitials(comment.profiles?.full_name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-gray-50 p-3">
                      <p className="text-sm font-medium">{comment.profiles?.full_name}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleComment}
                disabled={!commentText.trim()}
                size="icon"
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
