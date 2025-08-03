import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "../../../api/client"
import { PostsListSkeleton } from "../../../components/loading/PostsListSkeleton"
import { Card, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Calendar, User } from "lucide-react"

export const Route = createFileRoute("/_authenticated/forums_/$forumId")({
  loader: async ({ params }) => {
    const forumId = parseInt(params.forumId)
    const [forum, posts] = await Promise.all([api.getForum(forumId), api.getPostsByForum(forumId)])

    if (!forum) {
      throw new Error("Forum not found")
    }

    return { forum, posts }
  },
  pendingComponent: PostsListSkeleton,
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
          <Link key={post.id} to="/forums/$forumId/$postId" params={{ forumId, postId: post.id.toString() }} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
