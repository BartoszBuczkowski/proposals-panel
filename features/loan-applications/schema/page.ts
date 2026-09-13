import { z } from "zod"
import { loanApplicationsSchema } from "./loan-application"
import { PAGE_SIZE } from "./query"

export const loanApplicationsPageSchema = z.object({
  items: loanApplicationsSchema,
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(PAGE_SIZE),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

export type LoanApplicationsPage = z.infer<typeof loanApplicationsPageSchema>
