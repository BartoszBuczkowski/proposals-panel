"use client"

import { createContext, use, type ReactNode } from "react"
import { useLoanApplicationsColumns } from "../hooks/use-loan-applications-columns"
import { useLoanApplicationsQuery } from "../hooks/use-loan-applications-query"
import { useLoanApplicationsRows } from "../hooks/use-loan-applications-rows"
import type {
  ColumnMetadata,
  LoanApplication,
  LoanApplicationsFilters,
  LoanApplicationsPagination,
  PanelStatus,
} from "../types"

type LoanApplicationsContextValue = {
  state: {
    status: PanelStatus
    columns: ColumnMetadata[]
    rows: LoanApplication[]
    filters: LoanApplicationsFilters
    pagination: LoanApplicationsPagination
    errorMessage: string | null
  }
  actions: {
    setStatusFilter: (status: string | null) => void
    setSearch: (search: string) => void
    setPage: (page: number) => void
    reload: () => void
    simulateError: () => void
  }
  meta: {
    hasActiveFilters: boolean
  }
}

const LoanApplicationsContext =
  createContext<LoanApplicationsContextValue | null>(null)

export function LoanApplicationsProvider({
  children,
}: {
  children: ReactNode
}) {
  const {
    state: queryState,
    actions: queryActions,
    meta: queryMeta,
  } = useLoanApplicationsQuery()
  const { state: columnsState, actions: columnsActions } =
    useLoanApplicationsColumns()
  const { state: rowsState, actions: rowsActions } = useLoanApplicationsRows(
    queryState.query
  )

  const panelStatus: PanelStatus = (() => {
    if (columnsState.status === "loading" || rowsState.status === "loading") {
      return "loading"
    }
    if (columnsState.status === "error" || rowsState.status === "error") {
      return "error"
    }
    if (rowsState.status === "empty") {
      return "empty"
    }
    return "success"
  })()

  const errorMessage =
    columnsState.errorMessage ?? rowsState.errorMessage ?? null

  const value: LoanApplicationsContextValue = {
    state: {
      status: panelStatus,
      columns: columnsState.columns,
      rows: rowsState.rows,
      filters: queryState.filters,
      pagination: rowsState.pagination,
      errorMessage,
    },
    actions: {
      setStatusFilter: queryActions.setStatusFilter,
      setSearch: queryActions.setSearch,
      setPage: queryActions.setPage,
      reload: () => {
        columnsActions.reload()
        rowsActions.reload()
      },
      simulateError: rowsActions.simulateError,
    },
    meta: {
      hasActiveFilters: queryMeta.hasActiveFilters,
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
