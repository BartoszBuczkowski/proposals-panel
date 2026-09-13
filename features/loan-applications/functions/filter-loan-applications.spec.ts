import { describe, expect, it } from "vitest"
import {
  editActionColumn,
  loanApplicationRows,
} from "../loan-applications.fixture"
import {
  filterLoanApplications,
  isRowActionAvailable,
} from "./filter-loan-applications"
import {
  compareNullableDates,
  compareNullableNumbers,
} from "./sort-value"

describe("filterLoanApplications", () => {
  it("filters by status and searches customerName and loanId", () => {
    expect(
      filterLoanApplications(loanApplicationRows, {
        status: "new",
        search: "",
      }).map((row) => row.loanId)
    ).toEqual(["LN-1", "LN-3"])

    expect(
      filterLoanApplications(loanApplicationRows, {
        status: null,
        search: "jan",
      }).map((row) => row.loanId)
    ).toEqual(["LN-2"])

    expect(
      filterLoanApplications(loanApplicationRows, {
        status: "new",
        search: "LN-3",
      }).map((row) => row.loanId)
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
    expect(
      isRowActionAvailable(loanApplicationRows[0], editActionColumn)
    ).toBe(true)
    expect(
      isRowActionAvailable(loanApplicationRows[1], editActionColumn)
    ).toBe(false)
  })
})
