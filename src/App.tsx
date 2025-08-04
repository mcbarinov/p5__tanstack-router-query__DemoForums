import { RouterProvider } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/auth"
import { router } from "@/router"

export function App() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}
