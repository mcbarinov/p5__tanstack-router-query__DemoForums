import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "../../auth"

export function Header() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.logout()
    await navigate({ to: "/login", search: { redirect: undefined } })
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">DemoForums</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {auth.user}</span>
          <Link to="/forums" className="hover:text-gray-300">
            Forums
          </Link>
          <button type="button" onClick={() => void handleLogout()} className="hover:text-gray-300">
            Logout
          </button>
        </div>
      </nav>
    </header>
  )
}
