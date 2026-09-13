"use client"

import { useState } from "react"
import { useFetchValidated } from "@/lib/api/use-fetch-validated"
import { loanApplicationsPageSchema } from "../../schema"
import type { LoanApplicationsQuery } from "../../types"
import { buildRowsUrl } from "./functions/build-rows-url"
import { toRowsState } from "./functions/to-rows-state"

export function useLoanApplicationsRows(query: LoanApplicationsQuery) {
  const [simulateError, setSimulateError] = useState(false)
  const baseUrl = buildRowsUrl(query)
  const [activeBaseUrl, setActiveBaseUrl] = useState(baseUrl)

  if (activeBaseUrl !== baseUrl) {
    setActiveBaseUrl(baseUrl)
    if (simulateError) {
      setSimulateError(false)
    }
  }

  const { state, actions } = useFetchValidated(
    buildRowsUrl(query, { simulateError }),
    loanApplicationsPageSchema
  )

  return {
    state: toRowsState(state),
    actions: {
      reload: () => {
        setSimulateError(false)
        actions.reload()
      },
      simulateError: () => {
        setSimulateError(true)
        actions.reload()
      },
    },
  }
}
