"use client"

import { useMemo } from "react"
import { useTable } from "@tanstack/react-table"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { buildColumns } from "../functions/build-columns"
import { loanApplicationsTableFeatures } from "../functions/table-features"
import { useLoanApplications } from "./loan-applications-provider"

const EMPTY_DATA: never[] = []

export function LoanApplicationsTable() {
  const { state } = useLoanApplications()

  const columns = useMemo(
    () => buildColumns(state.columns),
    [state.columns]
  )

  const data = state.filteredRows.length > 0 ? state.filteredRows : EMPTY_DATA

  const table = useTable(
    {
      features: loanApplicationsTableFeatures,
      columns,
      data,
      getRowId: (row) => row.loanId,
    },
    (tableState) => ({
      sorting: tableState.sorting,
    })
  )

  return (
    <div className="overflow-x-auto rounded-none border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {sorted === "asc" ? (
                          <CaretUpIcon />
                        ) : sorted === "desc" ? (
                          <CaretDownIcon />
                        ) : null}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
