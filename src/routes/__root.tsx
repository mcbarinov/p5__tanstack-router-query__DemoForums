import { createRootRouteWithContext, Outlet, redirect, useLocation } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { QueryClient } from "@tanstack/react-query"

import type { AuthContext } from "@/auth"
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout"

interface RouterContext {
  auth: AuthContext
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location }) => {
    // Only allow /login route without authentication
    if (location.pathname === "/login") {
      return
    }

    // All other routes require authentication
    if (!context.auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()

  // If it's login page, render without authenticated layout
  if (location.pathname === "/login") {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  }

  // For all other routes, wrap in authenticated layout
  return (
    <>
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
      <TanStackRouterDevtools />
    </>
  )
}
