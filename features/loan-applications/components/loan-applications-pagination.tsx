"use client"

import { Button } from "@/components/ui/button"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsPagination() {
  const { state, actions } = useLoanApplications()
  const { page, totalPages, total } = state.pagination

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => actions.setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => actions.setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
