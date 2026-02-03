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
  Hash,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"

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
  created_at: string
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-brand-gold/20 mx-auto md:mx-0">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-brand-gold/20 text-foreground text-2xl md:text-3xl">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-3 gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{profile.full_name}</h1>
                  <p className="text-base md:text-lg text-muted-foreground">{profile.department}</p>
                </div>
                {isOwnProfile && (
                  <Button asChild variant="outline" className="bg-transparent">
                    <Link href="/settings">Edit Profile</Link>
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 md:gap-4 mb-4 justify-center md:justify-start">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs md:text-sm">{profile.university}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs md:text-sm">{profile.year_of_study}</span>
                </div>
              </div>

              {profile.bio && <p className="text-sm leading-relaxed mb-4">{profile.bio}</p>}

              {/* Contact & Social */}
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
                  <a href={`mailto:${userEmail}`}>
                    <Mail className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Email
                  </a>
                </Button>
                {profile.phone && (
                  <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
                    <a href={`tel:${profile.phone}`}>
                      <Phone className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      Phone
                    </a>
                  </Button>
                )}
                {profile.linkedin_url && (
                  <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.github_url && (
                  <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {profile.portfolio_url && (
                  <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      Portfolio
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Virtual ID Card */}
      <Card className="mb-6 relative overflow-hidden bg-gradient-to-br from-primary via-amber-400 to-yellow-500 border-0 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full blur-3xl transform translate-x-16 md:translate-x-32 -translate-y-16 md:-translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full blur-3xl transform -translate-x-16 md:-translate-x-32 translate-y-16 md:translate-y-32"></div>
        </div>

        <div className="relative p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-white" />
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-white">CampusHub</h2>
                <p className="text-xs text-white/90 hidden md:block">Student Identification</p>
              </div>
            </div>
            <Badge className="bg-white text-foreground hover:bg-white/90 text-xs md:text-sm">
              {profile.year_of_study}
            </Badge>
          </div>

          {/* Student Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-20 w-20 md:h-32 md:w-32 border-3 md:border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-white text-brand-red-hover text-lg md:text-2xl font-bold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-green-500 border-3 md:border-4 border-white rounded-full p-0.5 md:p-1">
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-white space-y-2 md:space-y-3 text-center md:text-left">
              <div>
                <h3 className="text-xl md:text-3xl font-bold mb-1">{profile.full_name}</h3>
                <p className="text-white/90 text-sm md:text-lg">{profile.department}</p>
                <p className="text-white/80 text-xs md:text-sm">{profile.university}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-4">
                <div className="flex items-center gap-2 text-xs md:text-sm justify-center md:justify-start">
                  <Hash className="h-3 w-3 md:h-4 md:w-4" />
                  <div>
                    <p className="text-white/70 text-xs">Student ID</p>
                    <p className="font-semibold text-xs md:text-sm">{profile.student_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm justify-center md:justify-start">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <div>
                    <p className="text-white/70 text-xs">Member Since</p>
                    <p className="font-semibold text-xs md:text-sm">{new Date(profile.created_at).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 md:p-3 rounded-lg shadow-lg flex-shrink-0">
              <QRCodeSVG
                value={`https://campushub.app/student/${profile.id}`}
                size={80}
                level="H"
                className="md:w-[100px] md:h-[100px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-white/80 text-xs gap-2">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="text-xs">{userEmail}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span className="text-xs">{profile.phone}</span>
                </div>
              )}
            </div>
            <p className="text-xs">Valid • {new Date().getFullYear()}</p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      {profile.user_skills && profile.user_skills.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Award className="h-4 w-4 md:h-5 md:w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.user_skills.map((us) => (
                <Badge key={us.skills.id} variant="secondary" className="bg-primary text-foreground text-xs md:text-sm">
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
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold text-base md:text-lg">{exp.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{exp.company}</p>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(exp.start_date), "MMM yyyy")} -{" "}
                        {exp.is_current ? "Present" : format(new Date(exp.end_date), "MMM yyyy")}
                      </span>
                    </div>
                    {exp.location && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  {exp.description && <p className="text-xs md:text-sm mt-2 leading-relaxed">{exp.description}</p>}
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
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FolderGit2 className="h-4 w-4 md:h-5 md:w-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                  {project.image_url && (
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-sm md:text-base mb-2">{project.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                  {project.url && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent text-xs md:text-sm" asChild>
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
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Award className="h-4 w-4 md:h-5 md:w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col md:flex-row md:items-start justify-between border-l-2 border-green-200 pl-4 gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{cert.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{cert.issuing_organization}</p>
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
