import type { ColumnMetadata, LoanApplication } from "./types"

export const loanApplicationRows: LoanApplication[] = [
  {
    loanId: "LN-1",
    customerName: "Anna Kowalska",
    status: "new",
    market: "PL",
    monthlyRate: 100,
    updatedAt: "2026-01-01T00:00:00Z",
    permissions: { canEdit: true },
  },
  {
    loanId: "LN-2",
    customerName: "Jan Nowak",
    status: "approved",
    market: "DE",
    monthlyRate: 200,
    updatedAt: "2026-02-01T00:00:00Z",
    permissions: { canEdit: false },
  },
  {
    loanId: "LN-3",
    customerName: "Anna Nowak",
    status: "new",
    market: "CZ",
    monthlyRate: null,
    updatedAt: null,
    permissions: { canEdit: true },
  },
]

export const editActionColumn: ColumnMetadata = {
  key: "canEdit",
  label: "Edit",
  type: "action",
  sortable: false,
  filterable: false,
  action: "edit",
}

export function loanApplicationWithEditPermission(
  canEdit: boolean
): LoanApplication {
  return {
    ...loanApplicationRows[0],
    customerName: "Test User",
    permissions: { canEdit },
  }
}
