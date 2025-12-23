import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  console.log("[v0] Middleware triggered for:", request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("[v0] User authenticated:", !!user, "Error:", !!error)

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isOnboarding = request.nextUrl.pathname.startsWith("/onboarding")
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/feed") ||
    request.nextUrl.pathname.startsWith("/talent") ||
    request.nextUrl.pathname.startsWith("/events") ||
    request.nextUrl.pathname.startsWith("/discounts") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/notifications")

  if (request.nextUrl.pathname === "/") {
    if (user) {
      // Redirect authenticated users to feed
      return NextResponse.redirect(new URL("/feed", request.url))
    }
    return supabaseResponse
  }

  if (user && isAuthPage) {
    console.log("[v0] Redirecting authenticated user from auth page to feed")
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  if (!user && isProtectedRoute) {
    console.log("[v0] Redirecting unauthenticated user to login")
    const url = new URL("/auth/login", request.url)
    return NextResponse.redirect(url)
  }

  if (user && !isAuthPage && !isOnboarding && isProtectedRoute) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .single()

      console.log("[v0] Profile check:", !!profile, "Error:", !!profileError)

      if (!profile || !profile.full_name) {
        console.log("[v0] Redirecting to onboarding - profile incomplete")
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    } catch (err) {
      console.log("[v0] Error checking profile:", err)
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  console.log("[v0] Allowing request to proceed")
  return supabaseResponse
}
