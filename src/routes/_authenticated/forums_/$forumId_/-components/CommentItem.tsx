import type { Comment } from "../../../../../types"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold">{comment.author}</span>
        <span className="text-sm text-gray-600">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  )
}
