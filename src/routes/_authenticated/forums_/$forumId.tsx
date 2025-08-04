import { createFileRoute, Link } from "@tanstack/react-router"

import { forumQueryOptions, forumPostsQueryOptions, useForumQuery, useForumPostsQuery } from "@/lib/queries"
import { PostsListSkeleton } from "@/components/loading/PostsListSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const Route = createFileRoute("/_authenticated/forums_/$forumId")({
  params: {
    parse: (rawParams) => {
      const forumId = parseInt(rawParams.forumId)
      if (isNaN(forumId) || forumId <= 0) {
        throw new Error(`Invalid forum ID: ${rawParams.forumId}`)
      }
      return { forumId }
    },
  },
  loader: async ({ context: { queryClient }, params }) => {
    const [forum, posts] = await Promise.all([
      queryClient.ensureQueryData(forumQueryOptions(params.forumId)),
      queryClient.ensureQueryData(forumPostsQueryOptions(params.forumId)),
    ])

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
  const { data: forum } = useForumQuery(forumId)
  const { data: posts } = useForumPostsQuery(forumId)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{forum.name}</h2>
          <Badge variant="secondary">{forum.category}</Badge>
        </div>
        <Link to="/forums/$forumId/new" params={{ forumId }}>
          <Button>New Post</Button>
        </Link>
      </div>
      <p className="text-gray-600 mb-6">{forum.description}</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Post Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="hover:bg-muted/50 cursor-pointer">
              <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <Link
                  to="/forums/$forumId/$postId"
                  params={{ forumId, postId: post.id }}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
