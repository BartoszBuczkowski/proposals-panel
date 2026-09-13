import type { LoanApplicationsQuery } from "../types"

export type QueryInput = {
  search: string | undefined
  status: string | null
  page: string | undefined
  pageSize: string | undefined
}

export function toQueryInput(searchParams: URLSearchParams): QueryInput {
  const statusParam = searchParams.get("status")

  return {
    search: searchParams.get("search") ?? undefined,
    status:
      statusParam === null || statusParam === "" ? null : statusParam,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  }
}

export function buildSearchParams(
  query: LoanApplicationsQuery
): URLSearchParams {
  const params = new URLSearchParams()

  if (query.search.trim().length > 0) {
    params.set("search", query.search)
  }

  if (query.status) {
    params.set("status", query.status)
  }

  if (query.page > 1) {
    params.set("page", String(query.page))
  }

  return params
}
