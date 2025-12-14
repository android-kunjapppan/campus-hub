import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagesInterface } from "@/components/messages-interface"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all conversations (unique users the current user has messaged with)
  const { data: messages } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:sender_id (
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] px-4 py-8">
      <MessagesInterface messages={messages || []} currentUserId={user.id} />
    </div>
  )
}
