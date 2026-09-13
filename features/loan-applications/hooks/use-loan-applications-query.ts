"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  buildSearchParams,
  toQueryInput,
} from "../functions/query-params"
import { loanApplicationsQuerySchema } from "../schema"
import type {
  LoanApplicationsFilters,
  LoanApplicationsQuery,
} from "../types"

export function useLoanApplicationsQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  const query = useMemo(
    () =>
      loanApplicationsQuerySchema.parse(
        toQueryInput(new URLSearchParams(searchParamsKey))
      ),
    [searchParamsKey]
  )

  const replaceQuery = useCallback(
    (next: LoanApplicationsQuery) => {
      const params = buildSearchParams(next)
      const queryString = params.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router]
  )

  const filters: LoanApplicationsFilters = {
    search: query.search,
    status: query.status,
  }

  return {
    state: {
      filters,
      page: query.page,
      query,
    },
    actions: {
      setSearch: (search: string) => {
        replaceQuery({ ...query, search, page: 1 })
      },
      setStatusFilter: (status: string | null) => {
        replaceQuery({ ...query, status, page: 1 })
      },
      setPage: (page: number) => {
        replaceQuery({ ...query, page })
      },
    },
    meta: {
      hasActiveFilters:
        query.status != null || query.search.trim().length > 0,
    },
  }
}
