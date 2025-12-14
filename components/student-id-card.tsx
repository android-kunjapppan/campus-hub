"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Mail, Phone, Calendar, Hash } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"

interface Profile {
  id: string
  full_name: string
  student_id: string
  university: string
  department: string
  year_of_study: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

interface StudentIdCardProps {
  profile: Profile
  userEmail: string
}

export function StudentIdCard({ profile, userEmail }: StudentIdCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDownload = () => {
    // In a real app, this would generate a downloadable card
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Main ID Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 border-0 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        </div>

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">CampusHub</h2>
                <p className="text-xs text-white/90">Student Identification</p>
              </div>
            </div>
            <Badge className="bg-white text-amber-700 hover:bg-white/90">{profile.year_of_study}</Badge>
          </div>

          {/* Student Info */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-white text-amber-600 text-2xl font-bold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full p-1">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-white space-y-3">
              <div>
                <h3 className="text-3xl font-bold mb-1">{profile.full_name}</h3>
                <p className="text-white/90 text-lg">{profile.department}</p>
                <p className="text-white/80 text-sm">{profile.university}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4" />
                  <div>
                    <p className="text-white/70 text-xs">Student ID</p>
                    <p className="font-semibold">{profile.student_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p className="text-white/70 text-xs">Member Since</p>
                    <p className="font-semibold">{new Date(profile.created_at).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <QRCodeSVG value={`https://campushub.app/student/${profile.id}`} size={100} level="H" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-white/80 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{userEmail}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
            <p>Valid • {new Date().getFullYear()}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1 bg-amber-500 hover:bg-amber-600">
          Download ID Card
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Share
        </Button>
      </div>

      {/* Compact Card View */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Wallet Size</h3>
        <Card className="bg-gradient-to-br from-navy-900 to-blue-900 border-0 shadow-xl p-4 max-w-sm">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-amber-500 text-white text-sm">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">{profile.full_name}</p>
                <p className="text-xs text-white/80">{profile.student_id}</p>
                <p className="text-xs text-white/70">{profile.university}</p>
              </div>
            </div>
            <QRCodeSVG value={`https://campushub.app/student/${profile.id}`} size={60} level="H" />
          </div>
        </Card>
      </div>
    </div>
  )
}
