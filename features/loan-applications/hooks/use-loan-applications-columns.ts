"use client"

import { useFetchValidated } from "@/lib/api/use-fetch-validated"
import { columnsSchema } from "../schema"
import type { ColumnMetadata } from "../types"

const EMPTY_COLUMNS: ColumnMetadata[] = []

export function useLoanApplicationsColumns() {
  const { state, actions } = useFetchValidated(
    "/api/columns",
    columnsSchema,
    { cache: "force-cache" }
  )

  return {
    state: {
      status: state.status,
      columns: state.data ?? EMPTY_COLUMNS,
      errorMessage: state.errorMessage,
    },
    actions,
  }
}
