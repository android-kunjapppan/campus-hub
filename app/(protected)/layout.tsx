import type React from "react"
import { MainNav } from "@/components/main-nav"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>{children}</main>
    </div>
  )
}
