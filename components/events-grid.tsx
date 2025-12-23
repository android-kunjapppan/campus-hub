"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Video, Users, Clock, Building2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, isPast } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  university: string
  event_type: string
  mode: "Online" | "Offline"
  location: string | null
  date: string
  image_url: string | null
  profiles: {
    full_name: string
    university: string
  }
}

interface EventsGridProps {
  events: Event[]
  currentUserId: string
}

const EVENT_TYPES = ["Workshop", "Hackathon", "Seminar", "Cultural", "Conference", "Meetup"]

export function EventsGrid({ events: initialEvents, currentUserId }: EventsGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "")
  const [timeFilter, setTimeFilter] = useState(searchParams.get("time") || "upcoming")

  const handleTypeFilter = (type: string) => {
    const newType = selectedType === type ? "" : type
    setSelectedType(newType)
    const params = new URLSearchParams()
    if (newType) params.set("type", newType)
    params.set("time", timeFilter)
    router.push(`/events?${params.toString()}`)
  }

  const handleTimeFilter = (time: string) => {
    setTimeFilter(time)
    const params = new URLSearchParams()
    if (selectedType) params.set("type", selectedType)
    params.set("time", time)
    router.push(`/events?${params.toString()}`)
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Workshop: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      Hackathon: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      Seminar: "bg-green-100 text-green-700 hover:bg-green-200",
      Cultural: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      Conference: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      Meetup: "bg-teal-100 text-teal-700 hover:bg-teal-200",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Time Filter Toggle */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={timeFilter === "upcoming" ? "default" : "outline"}
          onClick={() => handleTimeFilter("upcoming")}
          size="sm"
          className={`text-xs md:text-sm ${timeFilter === "upcoming" ? "bg-amber-500 hover:bg-amber-600" : "bg-transparent"}`}
        >
          Upcoming Events
        </Button>
        <Button
          variant={timeFilter === "past" ? "default" : "outline"}
          onClick={() => handleTimeFilter("past")}
          size="sm"
          className={`text-xs md:text-sm ${timeFilter === "past" ? "bg-amber-500 hover:bg-amber-600" : "bg-transparent"}`}
        >
          Past Events
        </Button>
      </div>

      {/* Event Type Filters */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm md:text-base">Filter by Type</h3>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {EVENT_TYPES.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-xs md:text-sm ${
                selectedType === type ? "bg-amber-500 hover:bg-amber-600" : "hover:bg-gray-50"
              }`}
              onClick={() => handleTypeFilter(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="border-t pt-4">
        <p className="text-xs md:text-sm text-muted-foreground">
          {initialEvents.length} {initialEvents.length === 1 ? "event" : "events"} found
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialEvents.length > 0 ? (
          initialEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Event Image */}
              {event.image_url ? (
                <div className="h-40 md:h-48 overflow-hidden">
                  <img
                    src={event.image_url || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 md:h-48 bg-gradient-to-br from-amber-100 to-blue-100 flex items-center justify-center">
                  <Calendar className="h-12 w-12 md:h-16 md:w-16 text-amber-500" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`${getEventTypeColor(event.event_type)} text-xs`}>{event.event_type}</Badge>
                  <Badge
                    variant={event.mode === "Online" ? "secondary" : "outline"}
                    className="flex items-center gap-1 text-xs"
                  >
                    {event.mode === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    {event.mode}
                  </Badge>
                </div>
                <h3 className="font-semibold text-base md:text-lg line-clamp-2">{event.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{format(new Date(event.date), "MMM dd, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(event.date), "h:mm a")}</p>
                  </div>
                </div>

                {/* University */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{event.university}</span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}

                {/* Organizer */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">Organized by {event.profiles.full_name}</span>
                </div>

                {/* Actions */}
                <Button className="w-full bg-amber-500 hover:bg-amber-600 mt-4 text-xs md:text-sm" size="sm">
                  {isPast(new Date(event.date)) ? "View Details" : "Register Now"}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed bg-white p-8 md:p-12 text-center">
            <Calendar className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm md:text-base text-muted-foreground">No events found matching your criteria.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 bg-transparent text-xs md:text-sm"
              onClick={() => {
                setSelectedType("")
                setTimeFilter("upcoming")
                router.push("/events")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
