import type {
  LoanApplication,
  LoanApplicationsPagination,
  PanelStatus,
} from "../../types"

export type RowsRequestOptions = {
  simulateError?: boolean
}

export type LoanApplicationsRowsState = {
  status: PanelStatus
  rows: LoanApplication[]
  pagination: LoanApplicationsPagination
  errorMessage: string | null
}
