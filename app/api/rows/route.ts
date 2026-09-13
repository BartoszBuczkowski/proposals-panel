import { readFile } from "node:fs/promises"
import path from "node:path"
import { filterLoanApplications } from "@/features/loan-applications/functions/filter-loan-applications"
import { toQueryInput } from "@/features/loan-applications/functions/query-params"
import {
  loanApplicationsPageSchema,
  loanApplicationsRowsQuerySchema,
  loanApplicationsSchema,
} from "@/features/loan-applications/schema"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("error") === "1") {
    return Response.json({ error: "Simulated rows failure" }, { status: 500 })
  }

  try {
    const query = loanApplicationsRowsQuerySchema.parse(
      toQueryInput(searchParams)
    )

    const filePath = path.join(process.cwd(), "data", "rows.json")
    const raw = await readFile(filePath, "utf8")
    const allRows = loanApplicationsSchema.parse(JSON.parse(raw))
    const filtered = filterLoanApplications(allRows, {
      search: query.search,
      status: query.status,
    })

    const total = filtered.length
    const totalPages = total === 0 ? 0 : Math.ceil(total / query.pageSize)
    const page = totalPages === 0 ? 1 : Math.min(query.page, totalPages)
    const start = (page - 1) * query.pageSize
    const items = filtered.slice(start, start + query.pageSize)

    const payload = loanApplicationsPageSchema.parse({
      items,
      page,
      pageSize: query.pageSize,
      total,
      totalPages,
    })

    return Response.json(payload)
  } catch (error) {
    console.error("Failed to load rows", error)
    return Response.json({ error: "Failed to load rows" }, { status: 500 })
  }
}
