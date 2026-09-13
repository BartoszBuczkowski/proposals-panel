"use client"

import { MagnifyingGlassIcon, TrayIcon } from "@phosphor-icons/react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useLoanApplicationsQuery } from "../hooks/use-loan-applications-query"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsEmpty() {
  const { state } = useLoanApplications()
  const { meta } = useLoanApplicationsQuery()
  if (state.status !== "empty") return null

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {meta.hasActiveFilters ? <MagnifyingGlassIcon /> : <TrayIcon />}
        </EmptyMedia>
        <EmptyTitle>
          {meta.hasActiveFilters
            ? "No matching loan applications"
            : "No loan applications"}
        </EmptyTitle>
        <EmptyDescription>
          {meta.hasActiveFilters
            ? "Try a different status or search term."
            : "There are no rows to display."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
