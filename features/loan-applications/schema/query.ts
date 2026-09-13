import { z } from "zod"

export const PAGE_SIZE = 10

export const loanApplicationsQuerySchema = z.object({
  search: z.string().default(""),
  status: z
    .string()
    .min(1)
    .nullable()
    .optional()
    .transform((value) => value ?? null)
    .default(null),
  page: z.coerce.number().int().min(1).default(1),
})

export const loanApplicationsRowsQuerySchema =
  loanApplicationsQuerySchema.extend({
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(PAGE_SIZE)
      .default(PAGE_SIZE),
  })

export type LoanApplicationsQuery = z.infer<typeof loanApplicationsQuerySchema>
