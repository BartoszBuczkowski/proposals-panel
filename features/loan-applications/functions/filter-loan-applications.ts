import type {
  ColumnMetadata,
  LoanApplication,
  LoanApplicationsFilters,
} from "../types"

export function filterLoanApplications(
  rows: LoanApplication[],
  filters: LoanApplicationsFilters
): LoanApplication[] {
  const search = filters.search.trim().toLowerCase()

  return rows.filter((row) => {
    if (filters.status && row.status !== filters.status) {
      return false
    }

    if (!search) {
      return true
    }

    const loanId = String(row.loanId ?? "").toLowerCase()
    const customerName = String(row.customerName ?? "").toLowerCase()
    return loanId.includes(search) || customerName.includes(search)
  })
}

export function getStatusOptions(columns: ColumnMetadata[]): string[] {
  const statusColumn = columns.find((column) => column.key === "status")
  return statusColumn?.options ?? []
}

export function isColumnVisible(column: ColumnMetadata): boolean {
  return column.visible !== false
}

export function isRowActionAvailable(
  row: LoanApplication,
  column: ColumnMetadata
): boolean {
  return row.permissions?.[column.key] === true
}
