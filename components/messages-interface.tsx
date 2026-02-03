"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  receiver: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

interface MessagesInterfaceProps {
  messages: Message[]
  currentUserId: string
}

export function MessagesInterface({ messages: initialMessages, currentUserId }: MessagesInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Get unique conversations
  const conversations = messages.reduce(
    (acc, msg) => {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
      const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender

      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        }
      }

      // Count unread messages
      if (msg.receiver_id === currentUserId && !msg.is_read) {
        acc[otherUserId].unreadCount++
      }

      return acc
    },
    {} as Record<
      string,
      {
        user: { id: string; full_name: string; avatar_url: string | null }
        lastMessage: Message
        unreadCount: number
      }
    >,
  )

  // Get messages for selected conversation
  const conversationMessages = selectedUserId
    ? messages
        .filter(
          (msg) =>
            (msg.sender_id === selectedUserId && msg.receiver_id === currentUserId) ||
            (msg.sender_id === currentUserId && msg.receiver_id === selectedUserId),
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : []

  const selectedUserData = selectedUserId ? conversations[selectedUserId]?.user : null

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUserId) return

    const supabase = createClient()

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: selectedUserId,
      content: messageText,
    })

    if (!error) {
      setMessageText("")
      router.refresh()
    }
  }

  const filteredConversations = Object.entries(conversations).filter(([_, conv]) =>
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-4 h-full">
      {/* Conversations List */}
      <Card className="flex flex-col">
        <CardHeader>
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(([userId, conv]) => (
                <button
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b ${
                    selectedUserId === userId ? "bg-primary" : ""
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.user.avatar_url || undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(conv.user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{conv.user.full_name}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.lastMessage.created_at))} ago
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No conversations yet</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-col">
        {selectedUserId && selectedUserData ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUserData.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getInitials(selectedUserData.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedUserData.full_name}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {conversationMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === currentUserId ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${msg.sender_id === currentUserId ? "text-brand-gold/20" : "text-gray-500"}`}
                        >
                          {formatDistanceToNow(new Date(msg.created_at))} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} className="bg-primary hover:bg-brand-red-hover">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  )
}
