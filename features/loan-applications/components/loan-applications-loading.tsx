"use client"

import { LoanApplicationsSkeleton } from "./loan-applications-skeleton"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsLoading() {
  const { state } = useLoanApplications()
  if (state.status !== "loading") return null

  return <LoanApplicationsSkeleton />
}
