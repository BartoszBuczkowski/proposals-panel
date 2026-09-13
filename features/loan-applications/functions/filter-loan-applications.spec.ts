import { describe, expect, it } from "vitest"
import {
  filterLoanApplications,
  isRowActionAvailable,
} from "./filter-loan-applications"
import {
  compareNullableDates,
  compareNullableNumbers,
} from "./sort-value"
import type { ColumnMetadata, LoanApplication } from "../types"

const rows: LoanApplication[] = [
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

describe("filterLoanApplications", () => {
  it("filters by status and searches customerName and loanId", () => {
    expect(
      filterLoanApplications(rows, { status: "new", search: "" }).map(
        (row) => row.loanId
      )
    ).toEqual(["LN-1", "LN-3"])

    expect(
      filterLoanApplications(rows, { status: null, search: "jan" }).map(
        (row) => row.loanId
      )
    ).toEqual(["LN-2"])

    expect(
      filterLoanApplications(rows, { status: "new", search: "LN-3" }).map(
        (row) => row.loanId
      )
    ).toEqual(["LN-3"])
  })
})

describe("nullable sorting", () => {
  it("places missing numeric and date values after defined values", () => {
    const rates = [null, 10, undefined, 2].sort(compareNullableNumbers)
    expect(rates).toEqual([2, 10, null, undefined])

    const dates = [null, "2026-02-01", undefined, "2026-01-01"].sort(
      compareNullableDates
    )
    expect(dates).toEqual(["2026-01-01", "2026-02-01", null, undefined])
  })
})

describe("isRowActionAvailable", () => {
  it("uses permissions keyed by column key", () => {
    const column: ColumnMetadata = {
      key: "canEdit",
      label: "Edit",
      type: "action",
      sortable: false,
      filterable: false,
      action: "edit",
    }

    expect(isRowActionAvailable(rows[0], column)).toBe(true)
    expect(isRowActionAvailable(rows[1], column)).toBe(false)
  })
})
