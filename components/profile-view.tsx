"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Profile {
  id: string
  full_name: string
  student_id: string
  university: string
  department: string
  year_of_study: string
  bio: string | null
  phone: string | null
  avatar_url: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  user_skills?: Array<{
    skills: {
      id: string
      name: string
      category: string
    }
  }>
}

interface ProfileViewProps {
  profile: Profile | null
  experience: any[]
  projects: any[]
  certifications: any[]
  isOwnProfile: boolean
  userEmail: string
}

export function ProfileView({
  profile,
  experience,
  projects,
  certifications,
  isOwnProfile,
  userEmail,
}: ProfileViewProps) {
  if (!profile) {
    return <div>Profile not found</div>
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-amber-100">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-amber-100 text-amber-700 text-3xl">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile.full_name}</h1>
                  <p className="text-lg text-muted-foreground">{profile.department}</p>
                </div>
                {isOwnProfile && (
                  <Button asChild variant="outline" className="bg-transparent">
                    <Link href="/settings">Edit Profile</Link>
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{profile.university}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.year_of_study}</span>
                </div>
              </div>

              {profile.bio && <p className="text-sm leading-relaxed mb-4">{profile.bio}</p>}

              {/* Contact & Social */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="bg-transparent" asChild>
                  <a href={`mailto:${userEmail}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
                {profile.phone && (
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <a href={`tel:${profile.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </a>
                  </Button>
                )}
                {profile.linkedin_url && (
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.github_url && (
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {profile.portfolio_url && (
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Portfolio
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {profile.user_skills && profile.user_skills.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.user_skills.map((us) => (
                <Badge key={us.skills.id} variant="secondary" className="bg-amber-50 text-amber-700">
                  {us.skills.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-amber-200 pl-4">
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(exp.start_date), "MMM yyyy")} -{" "}
                      {exp.is_current ? "Present" : format(new Date(exp.end_date), "MMM yyyy")}
                    </span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  {exp.description && <p className="text-sm mt-2 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                  {project.image_url && (
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  {project.url && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View Project
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start justify-between border-l-2 border-green-200 pl-4">
                  <div>
                    <h3 className="font-semibold">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuing_organization}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued {format(new Date(cert.issue_date), "MMM yyyy")}
                    </p>
                    {cert.credential_id && (
                      <p className="text-xs text-muted-foreground">Credential ID: {cert.credential_id}</p>
                    )}
                  </div>
                  {cert.credential_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
