import { buildSearchParams } from "../../../functions/query-params"
import type { LoanApplicationsQuery } from "../../../types"
import type { RowsRequestOptions } from "../types"

export function buildRowsUrl(
  query: LoanApplicationsQuery,
  options: RowsRequestOptions = {}
): string {
  const params = buildSearchParams(query)

  if (options.simulateError) {
    params.set("error", "1")
  }

  const queryString = params.toString()
  return queryString ? `/api/rows?${queryString}` : "/api/rows"
}
