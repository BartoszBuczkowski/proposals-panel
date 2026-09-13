"use client"

import { useCallback, useEffect, useState } from "react"
import {
  columnsSchema,
  loanApplicationsSchema,
  type ColumnMetadata,
  type LoanApplication,
  type PanelStatus,
} from "../types"

type LoadOptions = {
  simulateError?: boolean
}

type LoanApplicationsDataState = {
  status: PanelStatus
  columns: ColumnMetadata[]
  rows: LoanApplication[]
  errorMessage: string | null
}

const EMPTY_COLUMNS: ColumnMetadata[] = []
const EMPTY_ROWS: LoanApplication[] = []

export function useLoanApplicationsData() {
  const [state, setState] = useState<LoanApplicationsDataState>({
    status: "loading",
    columns: EMPTY_COLUMNS,
    rows: EMPTY_ROWS,
    errorMessage: null,
  })

  const load = useCallback(async (options: LoadOptions = {}) => {
    setState((current) => ({
      ...current,
      status: "loading",
      errorMessage: null,
    }))

    try {
      const rowsUrl = options.simulateError
        ? "/api/rows?error=1"
        : "/api/rows"

      const [columnsResponse, rowsResponse] = await Promise.all([
        fetch("/api/columns"),
        fetch(rowsUrl),
      ])

      if (!columnsResponse.ok || !rowsResponse.ok) {
        throw new Error("Failed to load loan applications")
      }

      const columnsJson: unknown = await columnsResponse.json()
      const rowsJson: unknown = await rowsResponse.json()
      const columns = columnsSchema.parse(columnsJson)
      const rows = loanApplicationsSchema.parse(rowsJson)

      setState({
        status: rows.length === 0 ? "empty" : "success",
        columns,
        rows,
        errorMessage: null,
      })
    } catch (error) {
      setState({
        status: "error",
        columns: EMPTY_COLUMNS,
        rows: EMPTY_ROWS,
        errorMessage:
          error instanceof Error ? error.message : "Unexpected error",
      })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return {
    state,
    actions: {
      reload: () => load(),
      simulateError: () => load({ simulateError: true }),
    },
  }
}
