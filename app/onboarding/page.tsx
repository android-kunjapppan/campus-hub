"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const SKILL_OPTIONS = [
  "Frontend",
  "Backend",
  "React",
  "Python",
  "AI/ML",
  "UI/UX",
  "Design",
  "Data Science",
  "Marketing",
  "Finance",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Mobile Development",
  "DevOps",
]

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [university, setUniversity] = useState("")
  const [department, setDepartment] = useState("")
  const [yearOfStudy, setYearOfStudy] = useState("")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push("/auth/login")
      }
    }
    checkUser()
  }, [router])

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName,
        student_id: studentId,
        university,
        department,
        year_of_study: yearOfStudy,
        bio,
        phone,
      })

      if (profileError) throw profileError

      // Add skills if any selected
      if (selectedSkills.length > 0) {
        // Get skill IDs
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("id, name")
          .in("name", selectedSkills)

        if (skillsError) throw skillsError

        if (skillsData && skillsData.length > 0) {
          const userSkills = skillsData.map((skill) => ({
            user_id: userId,
            skill_id: skill.id,
          }))

          const { error: userSkillsError } = await supabase.from("user_skills").insert(userSkills)

          if (userSkillsError) throw userSkillsError
        }
      }

      router.push("/feed")
      router.refresh()
    } catch (error: unknown) {
      console.error(" Onboarding error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-navy-900">Welcome to CampusHub</h1>
          <p className="mt-2 text-muted-foreground">Complete your profile to get started</p>
        </div>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Student Profile Setup</CardTitle>
            <CardDescription>Tell us about yourself to connect with other students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    placeholder="STU123456"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    placeholder="Massachusetts Institute of Technology"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      placeholder="Computer Science"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="year">Year of Study *</Label>
                    <Select value={yearOfStudy} onValueChange={setYearOfStudy} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st_Year">1st Year</SelectItem>
                        <SelectItem value="2nd_Year">2nd Year</SelectItem>
                        <SelectItem value="3rd_Year">3rd Year</SelectItem>
                        <SelectItem value="4th_Year">4th Year</SelectItem>
                        <SelectItem value="5th_Year">5th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and goals..."
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Skills (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedSkills.includes(skill) ? "bg-amber-500 hover:bg-amber-600" : "hover:bg-amber-50"
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {selectedSkills.includes(skill) && <X className="ml-1 h-3 w-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isLoading}>
                  {isLoading ? "Creating profile..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
