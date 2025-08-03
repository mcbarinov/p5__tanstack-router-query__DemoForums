import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "../../api/client"
import { ForumsListSkeleton } from "../../components/loading/ForumsListSkeleton"
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export const Route = createFileRoute("/_authenticated/forums")({
  loader: async () => {
    const forums = await api.getForums()
    return { forums }
  },
  pendingComponent: ForumsListSkeleton,
  pendingMs: 100,
  component: ForumsList,
})

function ForumsList() {
  const { forums } = Route.useLoaderData()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Forums</h2>
      <div className="space-y-2">
        {forums.map((forum) => (
          <Link key={forum.id} to="/forums/$forumId" params={{ forumId: forum.id.toString() }} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{forum.name}</CardTitle>
                <CardDescription>{forum.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
