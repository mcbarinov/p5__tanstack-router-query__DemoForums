import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAuth } from "../auth"
import { useState } from "react"

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: search.redirect as string | undefined,
    }
  },
})

function LoginPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const auth = useAuth()
  const search = Route.useSearch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && !isLoading) {
      setIsLoading(true)
      try {
        await auth.login(username)
        await navigate({ to: search.redirect ?? "/forums" })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          onSubmit={(e) => {
            handleLogin(e).catch(console.error)
          }}
        >
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
