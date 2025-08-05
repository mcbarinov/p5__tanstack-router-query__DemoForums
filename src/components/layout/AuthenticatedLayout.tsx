import type { ReactNode } from "react"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </main>

      <Footer />
    </div>
  )
}
