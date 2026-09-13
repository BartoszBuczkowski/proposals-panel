"use client"

import {
  createContext,
  use,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { filterLoanApplications } from "../functions/filter-loan-applications"
import { useLoanApplicationsData } from "../hooks/use-loan-applications-data"
import type {
  ColumnMetadata,
  LoanApplication,
  LoanApplicationsFilters,
  PanelStatus,
} from "../types"

type LoanApplicationsContextValue = {
  state: {
    status: PanelStatus
    columns: ColumnMetadata[]
    rows: LoanApplication[]
    filteredRows: LoanApplication[]
    filters: LoanApplicationsFilters
    errorMessage: string | null
  }
  actions: {
    setStatusFilter: (status: string | null) => void
    setSearch: (search: string) => void
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
  const { state: dataState, actions: dataActions } = useLoanApplicationsData()
  const [filters, setFilters] = useState<LoanApplicationsFilters>({
    status: null,
    search: "",
  })

  const filteredRows = useMemo(
    () => filterLoanApplications(dataState.rows, filters),
    [dataState.rows, filters]
  )

  const hasActiveFilters =
    filters.status != null || filters.search.trim().length > 0

  const panelStatus: PanelStatus = (() => {
    if (dataState.status === "loading") return "loading"
    if (dataState.status === "error") return "error"
    if (dataState.rows.length === 0) return "empty"
    if (filteredRows.length === 0) return "empty"
    return "success"
  })()

  const value: LoanApplicationsContextValue = {
    state: {
      status: panelStatus,
      columns: dataState.columns,
      rows: dataState.rows,
      filteredRows,
      filters,
      errorMessage: dataState.errorMessage,
    },
    actions: {
      setStatusFilter: (status) =>
        setFilters((current) => ({ ...current, status })),
      setSearch: (search) => setFilters((current) => ({ ...current, search })),
      reload: dataActions.reload,
      simulateError: dataActions.simulateError,
    },
    meta: {
      hasActiveFilters,
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
