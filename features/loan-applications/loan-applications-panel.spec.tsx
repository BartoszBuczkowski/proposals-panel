import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ActionCell } from "./components/cells/action-cell"
import type { ColumnMetadata, LoanApplication } from "./types"

const column: ColumnMetadata = {
  key: "canEdit",
  label: "Edit",
  type: "action",
  sortable: false,
  filterable: false,
  action: "edit",
}

function row(canEdit: boolean): LoanApplication {
  return {
    loanId: "LN-1",
    customerName: "Test User",
    status: "new",
    market: "PL",
    monthlyRate: 100,
    updatedAt: "2026-01-01T00:00:00Z",
    permissions: { canEdit },
  }
}

describe("ActionCell", () => {
  it("disables edit when permission is false and enables when true", () => {
    const { rerender } = render(
      <ActionCell row={row(false)} column={column} />
    )

    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled()

    rerender(<ActionCell row={row(true)} column={column} />)
    expect(screen.getByRole("button", { name: "Edit" })).toBeEnabled()
  })
})
