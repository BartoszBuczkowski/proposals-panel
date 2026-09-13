import type { FetchValidatedState } from "@/lib/api/use-fetch-validated"
import { PAGE_SIZE } from "../../../schema"
import type {
  LoanApplication,
  LoanApplicationsPage,
  LoanApplicationsPagination,
} from "../../../types"
import type { LoanApplicationsRowsState } from "../types"

const EMPTY_ROWS: LoanApplication[] = []

export const EMPTY_PAGINATION: LoanApplicationsPagination = {
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

export function toRowsState(
  state: FetchValidatedState<LoanApplicationsPage>
): LoanApplicationsRowsState {
  if (state.status === "loading") {
    return {
      status: "loading",
      rows: EMPTY_ROWS,
      pagination: EMPTY_PAGINATION,
      errorMessage: null,
    }
  }

  if (state.status === "error" || state.data === null) {
    return {
      status: "error",
      rows: EMPTY_ROWS,
      pagination: EMPTY_PAGINATION,
      errorMessage: state.errorMessage,
    }
  }

  const { items, ...pagination } = state.data

  return {
    status: items.length === 0 ? "empty" : "success",
    rows: items,
    pagination,
    errorMessage: null,
  }
}
