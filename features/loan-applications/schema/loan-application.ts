import { z } from "zod"

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

export type LoanApplication = z.infer<typeof loanApplicationSchema>
