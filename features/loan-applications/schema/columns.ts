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

export type ColumnType = z.infer<typeof columnTypeSchema>
export type ColumnMetadata = z.infer<typeof columnMetadataSchema>
