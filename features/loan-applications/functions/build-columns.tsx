import type { ColumnDef } from "@tanstack/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import { ActionCell } from "../components/cells/action-cell"
import { BadgeCell } from "../components/cells/badge-cell"
import { CurrencyCell } from "../components/cells/currency-cell"
import { DateCell } from "../components/cells/date-cell"
import { TextCell } from "../components/cells/text-cell"
import { isColumnVisible } from "./filter-loan-applications"
import type { ColumnMetadata, LoanApplication } from "../types"
import type { LoanApplicationsTableFeatures } from "./table-features"

const columnHelper =
  createColumnHelper<LoanApplicationsTableFeatures, LoanApplication>()

function getRowValue(row: LoanApplication, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

export function buildColumns(
  columns: ColumnMetadata[]
): ColumnDef<LoanApplicationsTableFeatures, LoanApplication, unknown>[] {
  const visibleColumns = columns.filter(isColumnVisible)

  return visibleColumns.map((column) => {
    if (column.type === "action") {
      return columnHelper.display({
        id: column.key,
        header: column.label,
        enableSorting: false,
        cell: ({ row }) => (
          <ActionCell row={row.original} column={column} />
        ),
      })
    }

    return columnHelper.accessor((row) => getRowValue(row, column.key), {
      id: column.key,
      header: column.label,
      enableSorting: column.sortable,
      sortUndefined: "last",
      cell: ({ getValue }) => {
        const value = getValue()
        switch (column.type) {
          case "badge":
            return <BadgeCell value={value} />
          case "currency":
            return <CurrencyCell value={value} />
          case "date":
            return <DateCell value={value} />
          default:
            return <TextCell value={value} />
        }
      },
    })
  })
}
