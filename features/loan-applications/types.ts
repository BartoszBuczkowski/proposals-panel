import { z } from "zod"

export const columnTypeSchema = z.enum([
  "text",
  "badge",
  "currency",
  "date",
  "action",
])

export const columnMetadataSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: columnTypeSchema,
  sortable: z.boolean(),
  filterable: z.boolean(),
  visible: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  action: z.string().optional(),
})

export const columnsSchema = z.array(columnMetadataSchema)

export const loanApplicationSchema = z
  .object({
    loanId: z.string(),
    customerName: z.string(),
    status: z.string(),
    market: z.string(),
    monthlyRate: z.number().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    permissions: z.record(z.string(), z.boolean()),
  })
  .passthrough()

export const loanApplicationsSchema = z.array(loanApplicationSchema)

export type ColumnType = z.infer<typeof columnTypeSchema>
export type ColumnMetadata = z.infer<typeof columnMetadataSchema>
export type LoanApplication = z.infer<typeof loanApplicationSchema>

export type PanelStatus = "loading" | "success" | "empty" | "error"

export type LoanApplicationsFilters = {
  status: string | null
  search: string
}
