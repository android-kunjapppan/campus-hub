import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EventsGrid } from "@/components/events-grid"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; time?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Build events query
  let query = supabase
    .from("events")
    .select(
      `
      *,
      profiles:organizer_id (
        full_name,
        university
      )
    `,
    )
    .order("date", { ascending: true })

  // Filter by event type
  if (params.type) {
    query = query.eq("event_type", params.type)
  }

  // Filter by time (upcoming or past)
  const now = new Date().toISOString()
  if (params.time === "upcoming") {
    query = query.gte("date", now)
  } else if (params.time === "past") {
    query = query.lt("date", now)
  } else {
    // Default to upcoming events
    query = query.gte("date", now)
  }

  const { data: events } = await query.limit(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
        <p className="text-muted-foreground">
          Discover workshops, hackathons, seminars, and cultural events across universities
        </p>
      </div>

      <EventsGrid events={events || []} currentUserId={user.id} />
    </div>
  )
}
