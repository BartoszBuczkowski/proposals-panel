"use client"

import { createContext, use, type ReactNode } from "react"
import { useLoanApplicationsQuery } from "../hooks/use-loan-applications-query"
import { useLoanApplicationsRows } from "../hooks/use-loan-applications-rows"
import type {
  ColumnMetadata,
  LoanApplication,
  LoanApplicationsPagination,
  PanelStatus,
} from "../types"

type LoanApplicationsContextValue = {
  state: {
    status: PanelStatus
    columns: ColumnMetadata[]
    rows: LoanApplication[]
    pagination: LoanApplicationsPagination
    errorMessage: string | null
  }
  actions: {
    reload: () => void
    simulateError: () => void
  }
}

const LoanApplicationsContext =
  createContext<LoanApplicationsContextValue | null>(null)

export function LoanApplicationsProvider({
  children,
  columns,
}: {
  children: ReactNode
  columns: ColumnMetadata[]
}) {
  const {
    state: queryState,
  } = useLoanApplicationsQuery()
  const { state: rowsState, actions: rowsActions } = useLoanApplicationsRows(
    queryState.query
  )

  const value: LoanApplicationsContextValue = {
    state: {
      status: rowsState.status,
      columns,
      rows: rowsState.rows,
      pagination: rowsState.pagination,
      errorMessage: rowsState.errorMessage,
    },
    actions: {
      reload: rowsActions.reload,
      simulateError: rowsActions.simulateError,
    },
  }

  return (
    <LoanApplicationsContext value={value}>{children}</LoanApplicationsContext>
  )
}

export function useLoanApplications() {
  const context = use(LoanApplicationsContext)
  if (!context) {
    throw new Error(
      "useLoanApplications must be used within LoanApplicationsProvider"
    )
  }
  return context
}
