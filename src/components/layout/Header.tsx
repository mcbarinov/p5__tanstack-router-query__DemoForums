import { Link, useNavigate } from "@tanstack/react-router"

import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRefreshForums } from "@/lib/queries"

export function Header() {
  const auth = useAuth()
  const navigate = useNavigate()
  const refreshForums = useRefreshForums()

  const handleLogout = async () => {
    await auth.logout()
    await navigate({ to: "/login", search: { redirect: undefined } })
  }

  const handleRefreshForums = () => {
    refreshForums()
  }

  const userInitials = auth.user
    ? auth.user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">DemoForums</h1>
        <div className="flex items-center gap-4">
          <Link to="/forums" className="hover:text-gray-300">
            Forums
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-600 text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{auth.user?.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRefreshForums}>Refresh Forums</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void handleLogout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  )
}
