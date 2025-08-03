import { createFileRoute } from "@tanstack/react-router"

import { api } from "@/lib/api"
import { PostDetailSkeleton } from "@/components/loading/PostDetailSkeleton"
import { PostBreadcrumb } from "@/components/navigation/PostBreadcrumb"

import { PostInfo } from "./-components/PostInfo"
import { CommentItem } from "./-components/CommentItem"

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
  pendingComponent: PostDetailSkeleton,
  pendingMs: 100,
  component: PostDetail,
})

function PostDetail() {
  const { forumId } = Route.useParams()
  const { forum, post, comments } = Route.useLoaderData()

  return (
    <div>
      <PostBreadcrumb forum={forum} post={post} forumId={forumId} />

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
