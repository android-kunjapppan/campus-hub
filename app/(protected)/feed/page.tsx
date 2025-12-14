import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get posts with author details, likes count, and comments count
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:author_id (
        id,
        full_name,
        avatar_url,
        university,
        department
      ),
      post_likes (count),
      post_comments (count)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>

      {/* Create Post */}
      <CreatePost userProfile={profile} />

      {/* Posts Feed */}
      <div className="mt-6 space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user.id} />)
        ) : (
          <div className="rounded-lg border-2 border-dashed bg-white p-12 text-center">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  )
}
