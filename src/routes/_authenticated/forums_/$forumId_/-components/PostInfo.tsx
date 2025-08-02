import type { Post } from "../../../../../types"

interface PostInfoProps {
  post: Post
}

export function PostInfo({ post }: PostInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-600 mb-4">
        by {post.author} • {new Date(post.createdAt).toLocaleString()}
      </div>
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
    </div>
  )
}
