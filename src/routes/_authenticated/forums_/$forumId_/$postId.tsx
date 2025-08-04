import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { forumQueryOptions, postQueryOptions, postCommentsQueryOptions } from "@/lib/queries"
import { PostDetailSkeleton } from "@/components/loading/PostDetailSkeleton"
import { PostBreadcrumb } from "@/components/navigation/PostBreadcrumb"

import { PostInfo } from "./-components/PostInfo"
import { CommentItem } from "./-components/CommentItem"
import { CommentForm } from "./-components/CommentForm"

export const Route = createFileRoute("/_authenticated/forums_/$forumId_/$postId")({
  params: {
    parse: (rawParams) => {
      const forumId = parseInt(rawParams.forumId)
      const postId = parseInt(rawParams.postId)

      if (isNaN(forumId) || forumId <= 0) {
        throw new Error(`Invalid forum ID: ${rawParams.forumId}`)
      }
      if (isNaN(postId) || postId <= 0) {
        throw new Error(`Invalid post ID: ${rawParams.postId}`)
      }

      return { forumId, postId }
    },
  },
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(forumQueryOptions(params.forumId)),
      queryClient.ensureQueryData(postQueryOptions(params.postId)),
      queryClient.ensureQueryData(postCommentsQueryOptions(params.postId)),
    ])
  },
  pendingComponent: PostDetailSkeleton,
  pendingMs: 100,
  component: PostDetail,
})

function PostDetail() {
  const { forumId, postId } = Route.useParams()
  const { data: forum } = useSuspenseQuery(forumQueryOptions(forumId))
  const { data: post } = useSuspenseQuery(postQueryOptions(postId))
  const { data: comments } = useSuspenseQuery(postCommentsQueryOptions(postId))

  return (
    <div>
      <PostBreadcrumb forum={forum} post={post} forumId={forumId} />

      <PostInfo post={post} />

      <CommentForm postId={postId} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      
    </div>
  )
}
