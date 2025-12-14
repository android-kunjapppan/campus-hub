import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Gift, GraduationCap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
              <GraduationCap className="h-4 w-4" />
              Exclusive for University Students
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-navy-900 md:text-6xl lg:text-7xl">
              Your Campus Network,
              <span className="text-amber-500"> Reimagined</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600 leading-relaxed">
              Connect with students, discover events, showcase your talents, and unlock exclusive discounts—all in one
              verified student platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
                <Link href="/auth/sign-up">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-24 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Network & Connect</h3>
              <p className="text-sm text-muted-foreground">
                Build your professional network with verified students from universities worldwide.
              </p>
            </div>

            <div className="rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Search Talents</h3>
              <p className="text-sm text-muted-foreground">
                Find skilled students for projects, collaborations, or team building.
              </p>
            </div>

            <div className="rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Campus Events</h3>
              <p className="text-sm text-muted-foreground">
                Discover workshops, hackathons, and events happening across campuses.
              </p>
            </div>

            <div className="rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Student Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Access exclusive deals on food, tech, fashion, and education.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CampusHub. Made for students, by students.</p>
        </div>
      </footer>
    </div>
  )
}
