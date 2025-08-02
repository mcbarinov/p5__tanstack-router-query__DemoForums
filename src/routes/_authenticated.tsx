import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
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
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}
