import { createFileRoute, Link } from "@tanstack/react-router"
import { PostInfo } from "./-components/PostInfo"
import { CommentItem } from "./-components/CommentItem"
import { api } from "../../../../api/client"
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner"

export const Route = createFileRoute("/_authenticated/forums_/$forumId_/$postId")({
  loader: async ({ params }) => {
    const postId = parseInt(params.postId)
    const forumId = parseInt(params.forumId)

    const [forum, post, comments] = await Promise.all([api.getForum(forumId), api.getPost(postId), api.getCommentsByPost(postId)])

    if (!forum || !post) {
      throw new Error("Post or forum not found")
    }

    return { forum, post, comments }
  },
  pendingComponent: LoadingSpinner,
  pendingMs: 100,
  component: PostDetail,
})

function PostDetail() {
  const { forumId } = Route.useParams()
  const { forum, post, comments } = Route.useLoaderData()

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Link to="/forums" className="text-blue-600 hover:underline">
          Forums
        </Link>
        <span>/</span>
        <Link to="/forums/$forumId" params={{ forumId }} className="text-blue-600 hover:underline">
          {forum.name}
        </Link>
      </div>

      <PostInfo post={post} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
