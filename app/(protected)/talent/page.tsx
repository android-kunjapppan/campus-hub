import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TalentSearch } from "@/components/talent-search"

export default async function TalentPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; skill?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all skills for filtering
  const { data: skills } = await supabase.from("skills").select("*").order("name")

  // Build search query
  let query = supabase
    .from("profiles")
    .select(
      `
      *,
      user_skills (
        skill_id,
        skills (
          id,
          name,
          category
        )
      )
    `,
    )
    .neq("id", user.id) // Exclude current user

  // Apply search filter
  if (params.search) {
    query = query.or(
      `full_name.ilike.%${params.search}%,university.ilike.%${params.search}%,department.ilike.%${params.search}%`,
    )
  }

  const { data: profiles } = await query.limit(50)

  // Filter by skill on the client side (since we need to check the joined data)
  let filteredProfiles = profiles || []
  if (params.skill) {
    filteredProfiles = filteredProfiles.filter((profile) =>
      profile.user_skills?.some((us: any) => us.skills?.name === params.skill),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Talents</h1>
        <p className="text-muted-foreground">Discover skilled students for your next project or collaboration</p>
      </div>

      <TalentSearch profiles={filteredProfiles} skills={skills || []} currentUserId={user.id} />
    </div>
  )
}
