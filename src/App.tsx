import { RouterProvider } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Toaster, toast } from "sonner"

import { useAuth } from "@/auth"
import { router } from "@/router"

export function App() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  // Handle automatic logout navigation
  useEffect(() => {
    const handleAutoLogout = () => {
      // Only show toast if we're not already on the login page
      const currentPath = router.state.location.pathname
      if (currentPath !== "/login") {
        toast.error("Session expired. Please login again.")
      }
      void router.navigate({
        to: "/login",
        search: { redirect: undefined },
      })
    }

    window.addEventListener("auth:logout", handleAutoLogout)
    return () => window.removeEventListener("auth:logout", handleAutoLogout)
  }, [])

  return (
    <>
      <RouterProvider router={router} context={{ auth, queryClient }} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
            border: "1px solid #374151",
          },
        }}
      />
    </>
  )
}
