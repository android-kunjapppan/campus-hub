"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, UserPlus, Calendar, CheckCheck } from "lucide-react"

interface Notification {
  id: string
  user_id: string
  type: string
  content: string
  related_id: string | null
  is_read: boolean
  created_at: string
  sender?: {
    full_name: string
    avatar_url: string | null
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        sender:profiles!notifications_related_id_fkey(full_name, avatar_url)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)))
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false)

    setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "connection":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />
      default:
        return <CheckCheck className="h-5 w-5 text-gray-500" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading notifications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">You have {unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
          <p className="text-sm text-muted-foreground">When you get notifications, they'll show up here</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.is_read ? "bg-primary/50 border-primary" : ""
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex gap-3 flex-1">
                  {notification.sender && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.sender.avatar_url || undefined} />
                      <AvatarFallback className="bg-brand-gold/20 text-foreground">
                        {getInitials(notification.sender.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!notification.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
