import { describe, expect, it } from "vitest"
import { buildSearchParams, toQueryInput } from "./query-params"

describe("toQueryInput", () => {
  it("maps empty status to null and missing values to undefined", () => {
    expect(toQueryInput(new URLSearchParams("status="))).toEqual({
      search: undefined,
      status: null,
      page: undefined,
      pageSize: undefined,
    })
  })

  it("reads present query values", () => {
    expect(
      toQueryInput(new URLSearchParams("search=anna&status=new&page=2&pageSize=10"))
    ).toEqual({
      search: "anna",
      status: "new",
      page: "2",
      pageSize: "10",
    })
  })
})

describe("buildSearchParams", () => {
  it("omits default values", () => {
    expect(
      buildSearchParams({ search: "", status: null, page: 1 }).toString()
    ).toBe("")
  })

  it("round-trips non-default filters", () => {
    const params = buildSearchParams({
      search: "anna",
      status: "new",
      page: 3,
    })

    expect(params.toString()).toBe("search=anna&status=new&page=3")
    expect(toQueryInput(params)).toEqual({
      search: "anna",
      status: "new",
      page: "3",
      pageSize: undefined,
    })
  })
})
