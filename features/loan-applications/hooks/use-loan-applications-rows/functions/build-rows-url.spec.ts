import { describe, expect, it } from "vitest"
import { buildRowsUrl } from "./build-rows-url"

describe("buildRowsUrl", () => {
  it("returns the bare path when query values are defaults", () => {
    expect(buildRowsUrl({ search: "", status: null, page: 1 })).toBe(
      "/api/rows"
    )
  })

  it("includes non-default filters and page", () => {
    expect(
      buildRowsUrl({ search: "anna", status: "new", page: 2 })
    ).toBe("/api/rows?search=anna&status=new&page=2")
  })

  it("appends simulate-error flag", () => {
    expect(
      buildRowsUrl({ search: "", status: null, page: 1 }, { simulateError: true })
    ).toBe("/api/rows?error=1")
  })
})
