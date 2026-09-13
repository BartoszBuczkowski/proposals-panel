"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isRowActionAvailable } from "../../functions/filter-loan-applications"
import type { ColumnMetadata, LoanApplication } from "../../types"

export function ActionCell({
  row,
  column,
}: {
  row: LoanApplication
  column: ColumnMetadata
}) {
  const available = isRowActionAvailable(row, column)

  return (
    <Button
      type="button"
      variant={available ? "outline" : "ghost"}
      size="sm"
      disabled={!available}
      aria-disabled={!available}
      onClick={() => {
        if (!available) return
        toast.info("Edit is not implemented")
      }}
    >
      Edit
    </Button>
  )
}
