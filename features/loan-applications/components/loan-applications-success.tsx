"use client"

import { LoanApplicationsTable } from "./loan-applications-table"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsSuccess() {
  const { state } = useLoanApplications()
  if (state.status !== "success") return null
  return <LoanApplicationsTable />
}
