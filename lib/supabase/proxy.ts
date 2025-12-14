import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
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
  } = await supabase.auth.getUser()

  // Redirect to login if accessing protected routes without authentication
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/feed") ||
      request.nextUrl.pathname.startsWith("/talent") ||
      request.nextUrl.pathname.startsWith("/events") ||
      request.nextUrl.pathname.startsWith("/discounts") ||
      request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/messages"))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect to onboarding if profile not complete
  if (
    user &&
    !request.nextUrl.pathname.startsWith("/onboarding") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!profile && request.nextUrl.pathname !== "/onboarding") {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
