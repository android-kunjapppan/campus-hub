import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DiscountsGrid } from "@/components/discounts-grid"

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Build discounts query
  let query = supabase.from("discounts").select("*").order("created_at", { ascending: false })

  // Filter by category
  if (params.category) {
    query = query.eq("category", params.category)
  }

  // Only show valid discounts
  const now = new Date().toISOString()
  query = query.gte("valid_until", now)

  const { data: discounts } = await query

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Discounts</h1>
        <p className="text-muted-foreground">
          Exclusive deals on food, tech, fashion, travel, and education - verified for students
        </p>
      </div>

      <DiscountsGrid discounts={discounts || []} />
    </div>
  )
}
