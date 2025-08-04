import { RouterProvider } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

import { useAuth } from "@/auth"
import { router } from "@/router"

export function App() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  // Handle automatic logout navigation
  useEffect(() => {
    const handleAutoLogout = () => {
      // Navigate to login page when user is automatically logged out
      void router.navigate({ to: "/login" })
    }

    window.addEventListener("auth:logout", handleAutoLogout)
    return () => window.removeEventListener("auth:logout", handleAutoLogout)
  }, [])

  return <RouterProvider router={router} context={{ auth, queryClient }} />
}
