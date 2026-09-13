"use client"

import { LoanApplicationsPagination } from "./loan-applications-pagination"
import { LoanApplicationsTable } from "./loan-applications-table"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsSuccess() {
  const { state } = useLoanApplications()
  if (state.status !== "success") return null
  return (
    <div className="flex flex-col gap-4">
      <LoanApplicationsTable />
      <LoanApplicationsPagination />
    </div>
  )
}
