import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export function PendingComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
