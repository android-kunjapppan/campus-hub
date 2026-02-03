"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  MessageSquare,
  Search,
  User,
  LogOut,
  Settings,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  full_name: string;
  avatar_url: string | null;
  university: string;
}

interface Notification {
  id: string;
  type: string;
  content: string;
  created_at: string;
  is_read: boolean;
  actor_profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: {
    full_name: string;
    avatar_url: string | null;
  };
}

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      console.log("[] Loading profile data...");
      setIsLoading(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.log("[] No user found");
          setIsLoading(false);
          return;
        }

        console.log("[] User found, fetching profile...");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, university")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("[] Profile fetch error:", profileError);
        } else if (profileData) {
          console.log("[] Profile loaded successfully");
          setProfile(profileData);
        }

        const { data: notifData, error: notifError } = await supabase
          .from("notifications")
          .select(
            `
            *,
            actor_profile:profiles!notifications_actor_id_fkey (
              full_name,
              avatar_url
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (notifError) {
          console.error("[] Notifications fetch error:", notifError);
        } else if (notifData) {
          setNotifications(notifData);
        }

        const { data: msgData, error: msgError } = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:profiles!messages_sender_id_fkey (
              full_name,
              avatar_url
            )
          `
          )
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (msgError) {
          console.error("[] Messages fetch error:", msgError);
        } else if (msgData) {
          setMessages(msgData);
        }

        const { count, error: msgCountError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("receiver_id", user.id)
          .eq("is_read", false);

        if (msgCountError) {
          console.error("[] Message count error:", msgCountError);
        } else if (count !== null) {
          setUnreadMessages(count);
        }

        const { count: notifCount, error: notifCountError } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false);

        if (notifCountError) {
          console.error("[] Notification count error:", notifCountError);
        } else if (notifCount !== null) {
          setUnreadNotifications(notifCount);
        }
      } catch (error) {
        console.error("[] Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/talent?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
    setUnreadNotifications((prev) => Math.max(0, prev - 1));
  };

  const markMessageRead = async (msgId: string) => {
    const supabase = createClient();
    await supabase.from("messages").update({ is_read: true }).eq("id", msgId);
    setUnreadMessages((prev) => Math.max(0, prev - 1));
  };

  const navItems = [
    { href: "/feed", label: "Feed" },
    { href: "/talent", label: "Search Talents" },
    { href: "/events", label: "Events" },
    { href: "/discounts", label: "Student Discounts" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "connection":
        return "🤝";
      case "event":
        return "📅";
      default:
        return "🔔";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/feed"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">CampusHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={
                  pathname === item.href
                    ? "bg-primary text-foreground hover:bg-brand-gold/20 text-white"
                    : ""
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students, skills..."
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Messages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
                    <DropdownMenuItem
                      key={msg.id}
                      className="flex gap-3 p-3 cursor-pointer"
                      onClick={() => {
                        markMessageRead(msg.id);
                        router.push("/messages");
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={msg.sender.avatar_url || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {getInitials(msg.sender.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {msg.sender.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {msg.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(msg.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!msg.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-brand-red-hover font-medium"
                    onClick={() => router.push("/messages")}
                  >
                    View All Messages
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No messages yet
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex gap-3 p-3 cursor-pointer"
                      onClick={() => {
                        markNotificationRead(notif.id);
                        router.push("/notifications");
                      }}
                    >
                      <div className="text-xl">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notif.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notif.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-brand-red-hover font-medium"
                    onClick={() => router.push("/notifications")}
                  >
                    View All Notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-brand-gold/20 text-foreground">
                    {profile ? (
                      getInitials(profile.full_name)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || "Loading..."}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.university || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="md:hidden border-t">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={
                  pathname === item.href ? "bg-primary text-foreground" : ""
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
