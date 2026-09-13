import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ActionCell } from "../../components/cells/action-cell"
import {
  editActionColumn,
  loanApplicationWithEditPermission,
} from "../../loan-applications.fixture"

describe("ActionCell", () => {
  it("disables edit when permission is false and enables when true", () => {
    const { rerender } = render(
      <ActionCell
        row={loanApplicationWithEditPermission(false)}
        column={editActionColumn}
      />
    )

    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled()

    rerender(
      <ActionCell
        row={loanApplicationWithEditPermission(true)}
        column={editActionColumn}
      />
    )
    expect(screen.getByRole("button", { name: "Edit" })).toBeEnabled()
  })
})
