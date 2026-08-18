import { Suspense, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

export function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-6 text-text-muted">
      <Loader2 className="h-6 w-6 animate-spin" aria-label="Loading page" />
    </div>
  )
}

export function withRouteSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteLoadingFallback />}>{element}</Suspense>
}
