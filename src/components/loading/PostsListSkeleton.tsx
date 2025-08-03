import { Skeleton } from "../ui/skeleton"
import { Card, CardHeader } from "../ui/card"

export function PostsListSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-6" />

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          // eslint-disable-next-line react-x/no-array-index-key
          <Card key={`post-skeleton-${i}`}>
            <CardHeader>
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
