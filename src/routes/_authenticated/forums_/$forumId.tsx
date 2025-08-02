import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "../../../api/client"
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner"

export const Route = createFileRoute("/_authenticated/forums_/$forumId")({
  loader: async ({ params }) => {
    const forumId = parseInt(params.forumId)
    const [forum, posts] = await Promise.all([api.getForum(forumId), api.getPostsByForum(forumId)])

    if (!forum) {
      throw new Error("Forum not found")
    }

    return { forum, posts }
  },
  pendingComponent: LoadingSpinner,
  pendingMs: 100,
  component: ForumPosts,
})

function ForumPosts() {
  const { forumId } = Route.useParams()
  const { forum, posts } = Route.useLoaderData()

  return (
    <div>
      <div className="mb-4">
        <Link to="/forums" className="text-blue-600 hover:underline">
          ← Back to forums
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-2">{forum.name}</h2>
      <p className="text-gray-600 mb-6">{forum.description}</p>

      <div className="space-y-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            to="/forums/$forumId/$postId"
            params={{ forumId, postId: post.id.toString() }}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <div className="text-sm text-gray-600 mt-1">
              by {post.author} • {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
