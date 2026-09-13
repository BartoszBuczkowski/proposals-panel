import { Skeleton } from "@/components/ui/skeleton"

export function LoanApplicationsSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
