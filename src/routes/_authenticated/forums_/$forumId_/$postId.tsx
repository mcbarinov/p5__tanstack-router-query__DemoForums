import { createFileRoute } from "@tanstack/react-router"

import {
  forumQueryOptions,
  postQueryOptions,
  postCommentsQueryOptions,
  useForumQuery,
  usePostQuery,
  usePostCommentsQuery,
} from "@/lib/queries"
import { PostDetailSkeleton } from "@/components/loading/PostDetailSkeleton"
import { PostBreadcrumb } from "@/components/navigation/PostBreadcrumb"

import { PostInfo } from "./-components/PostInfo"
import { CommentItem } from "./-components/CommentItem"

export const Route = createFileRoute("/_authenticated/forums_/$forumId_/$postId")({
  loader: async ({ context: { queryClient }, params }) => {
    const postId = parseInt(params.postId)
    const forumId = parseInt(params.forumId)

    const [forum, post, comments] = await Promise.all([
      queryClient.ensureQueryData(forumQueryOptions(forumId)),
      queryClient.ensureQueryData(postQueryOptions(postId)),
      queryClient.ensureQueryData(postCommentsQueryOptions(postId)),
    ])

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
  const { forumId, postId } = Route.useParams()
  const forumId_number = parseInt(forumId)
  const postId_number = parseInt(postId)
  const { data: forum } = useForumQuery(forumId_number)
  const { data: post } = usePostQuery(postId_number)
  const { data: comments } = usePostCommentsQuery(postId_number)

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
