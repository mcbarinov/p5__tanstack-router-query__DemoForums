import { Skeleton } from "../ui/skeleton"
import { Card, CardHeader } from "../ui/card"

export function ForumsListSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          // eslint-disable-next-line react-x/no-array-index-key
          <Card key={`forum-skeleton-${i}`}>
            <CardHeader>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
