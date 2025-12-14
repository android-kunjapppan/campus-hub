import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentIdCard } from "@/components/student-id-card"

export default async function IdCardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/onboarding")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Virtual ID</h1>
        <p className="text-muted-foreground">Your official CampusHub student identification card</p>
      </div>

      <StudentIdCard profile={profile} userEmail={user.email || ""} />

      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">About Your Student ID</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Your CampusHub Student ID is a verified digital identification that confirms your enrollment and connects
            you to the global student network.
          </p>
          <p>This ID can be used to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Verify your student status with other members</li>
            <li>Access exclusive student discounts</li>
            <li>Participate in campus events and activities</li>
            <li>Connect with verified students worldwide</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
