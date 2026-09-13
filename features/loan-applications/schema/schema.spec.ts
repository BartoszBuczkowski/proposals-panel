import { describe, expect, it } from "vitest"
import {
  loanApplicationsPageSchema,
  loanApplicationsQuerySchema,
  loanApplicationsRowsQuerySchema,
  PAGE_SIZE,
} from "./index"

describe("loanApplicationsQuerySchema", () => {
  it("applies defaults when values are missing", () => {
    expect(loanApplicationsQuerySchema.parse({})).toEqual({
      search: "",
      status: null,
      page: 1,
    })
  })

  it("parses search, status, and page", () => {
    expect(
      loanApplicationsQuerySchema.parse({
        search: "anna",
        status: "new",
        page: "3",
      })
    ).toEqual({
      search: "anna",
      status: "new",
      page: 3,
    })
  })

  it("treats empty status as null", () => {
    expect(
      loanApplicationsQuerySchema.parse({
        status: null,
      })
    ).toEqual({
      search: "",
      status: null,
      page: 1,
    })
  })
})

describe("loanApplicationsRowsQuerySchema", () => {
  it("defaults pageSize to PAGE_SIZE and rejects larger values", () => {
    expect(loanApplicationsRowsQuerySchema.parse({})).toMatchObject({
      pageSize: PAGE_SIZE,
    })

    expect(() =>
      loanApplicationsRowsQuerySchema.parse({ pageSize: PAGE_SIZE + 1 })
    ).toThrow()
  })
})

describe("loanApplicationsPageSchema", () => {
  it("accepts a paginated payload", () => {
    const page = loanApplicationsPageSchema.parse({
      items: [],
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    })

    expect(page.items).toEqual([])
    expect(page.pageSize).toBe(10)
  })
})
