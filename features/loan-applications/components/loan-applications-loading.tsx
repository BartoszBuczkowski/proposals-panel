"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsLoading() {
  const { state } = useLoanApplications()
  if (state.status !== "loading") return null

  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
