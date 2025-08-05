import type { Comment } from "@/types"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {comment.author} • {new Date(comment.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{comment.content}</p>
      </CardContent>
    </Card>
  )
}
