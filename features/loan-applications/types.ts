import type {
  ColumnMetadata,
  ColumnType,
  LoanApplication,
  LoanApplicationsPage,
  LoanApplicationsQuery,
} from "./schema"

export type {
  ColumnMetadata,
  ColumnType,
  LoanApplication,
  LoanApplicationsPage,
  LoanApplicationsQuery,
}

export type PanelStatus = "loading" | "success" | "empty" | "error"

export type LoanApplicationsFilters = {
  status: string | null
  search: string
}

export type LoanApplicationsPagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
