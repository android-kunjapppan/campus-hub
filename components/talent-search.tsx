"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search, X, UserPlus, MapPin, Briefcase } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Skill {
  id: string
  name: string
  category: string
}

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  university: string
  department: string
  year_of_study: string
  bio: string | null
  user_skills: Array<{
    skills: Skill
  }>
}

interface TalentSearchProps {
  profiles: Profile[]
  skills: Skill[]
  currentUserId: string
}

export function TalentSearch({ profiles: initialProfiles, skills, currentUserId }: TalentSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get("skill") || "")
  const [profiles, setProfiles] = useState(initialProfiles)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const params = new URLSearchParams()
    if (query) params.set("search", query)
    if (selectedSkill) params.set("skill", selectedSkill)
    router.push(`/talent?${params.toString()}`)
  }

  const handleSkillFilter = (skill: string) => {
    const newSkill = selectedSkill === skill ? "" : skill
    setSelectedSkill(newSkill)
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (newSkill) params.set("skill", newSkill)
    router.push(`/talent?${params.toString()}`)
  }

  const handleConnect = async (profileId: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("connections").insert({
      requester_id: currentUserId,
      receiver_id: profileId,
      status: "pending",
    })

    if (!error) {
      // Update UI to show connection sent
      alert("Connection request sent!")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, university, or department..."
          className="pl-10 pr-10 h-12 text-base"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Skill Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filter by Skills</h3>
          {selectedSkill && (
            <Button variant="ghost" size="sm" onClick={() => handleSkillFilter("")}>
              Clear Filter
            </Button>
          )}
        </div>

        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{category}</p>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant={selectedSkill === skill.name ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedSkill === skill.name
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                  }`}
                  onClick={() => handleSkillFilter(skill.name)}
                >
                  {skill.name}
                  {selectedSkill === skill.name && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {profiles.length} {profiles.length === 1 ? "student" : "students"} found
        </p>
      </div>

      {/* Student Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col items-center text-center gap-3">
                  <Avatar className="h-20 w-20 border-2 border-amber-100">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-xl">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.university}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {profile.year_of_study}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>}

                {/* Skills */}
                {profile.user_skills && profile.user_skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.user_skills.slice(0, 5).map((us) => (
                        <Badge key={us.skills.id} variant="outline" className="text-xs">
                          {us.skills.name}
                        </Badge>
                      ))}
                      {profile.user_skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.user_skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    size="sm"
                    onClick={() => router.push(`/profile/${profile.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                    onClick={() => handleConnect(profile.id)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed bg-white p-12 text-center">
            <p className="text-muted-foreground">
              No students found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
