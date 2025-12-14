import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileView } from "@/components/profile-view"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get profile with skills, experience, projects, and certifications
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      *,
      user_skills (
        skills (
          id,
          name,
          category
        )
      )
    `,
    )
    .eq("id", user.id)
    .single()

  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })

  const { data: projects } = await supabase.from("projects").select("*").eq("user_id", user.id)

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("user_id", user.id)
    .order("issue_date", { ascending: false })

  return (
    <ProfileView
      profile={profile}
      experience={experience || []}
      projects={projects || []}
      certifications={certifications || []}
      isOwnProfile={true}
      userEmail={user.email || ""}
    />
  )
}
