import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "../../api/client"
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"

export const Route = createFileRoute("/_authenticated/forums")({
  loader: async () => {
    const forums = await api.getForums()
    return { forums }
  },
  pendingComponent: LoadingSpinner,
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
          <Link
            key={forum.id}
            to="/forums/$forumId"
            params={{ forumId: forum.id.toString() }}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{forum.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{forum.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
