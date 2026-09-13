import { describe, expect, it } from "vitest"
import { EMPTY_PAGINATION, toRowsState } from "./to-rows-state"

describe("toRowsState", () => {
  it("maps loading state", () => {
    expect(
      toRowsState({
        status: "loading",
        data: null,
        errorMessage: null,
      })
    ).toEqual({
      status: "loading",
      rows: [],
      pagination: EMPTY_PAGINATION,
      errorMessage: null,
    })
  })

  it("maps error state", () => {
    expect(
      toRowsState({
        status: "error",
        data: null,
        errorMessage: "boom",
      })
    ).toEqual({
      status: "error",
      rows: [],
      pagination: EMPTY_PAGINATION,
      errorMessage: "boom",
    })
  })

  it("maps empty success payload", () => {
    expect(
      toRowsState({
        status: "success",
        data: {
          items: [],
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
        errorMessage: null,
      })
    ).toEqual({
      status: "empty",
      rows: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      errorMessage: null,
    })
  })

  it("maps success payload with items and pagination", () => {
    const row = {
      loanId: "LN-1",
      customerName: "Ada",
      status: "new",
      market: "PL",
      permissions: { canEdit: true },
    }

    expect(
      toRowsState({
        status: "success",
        data: {
          items: [row],
          page: 2,
          pageSize: 10,
          total: 12,
          totalPages: 2,
        },
        errorMessage: null,
      })
    ).toEqual({
      status: "success",
      rows: [row],
      pagination: {
        page: 2,
        pageSize: 10,
        total: 12,
        totalPages: 2,
      },
      errorMessage: null,
    })
  })
})
