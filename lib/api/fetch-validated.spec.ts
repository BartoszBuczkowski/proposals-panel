import { describe, expect, it, vi, afterEach } from "vitest"
import { z } from "zod"
import { ApiError } from "@/lib/api/errors"
import { fetchValidated } from "@/lib/api/fetch-validated"

describe("fetchValidated", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("parses a successful JSON response with the given schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ name: "Ada" }),
      })
    )

    const schema = z.object({ name: z.string() })
    await expect(fetchValidated("/api/example", schema)).resolves.toEqual({
      name: "Ada",
    })
  })

  it("throws ApiError when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "boom" }),
      })
    )

    const schema = z.object({ name: z.string() })
    await expect(fetchValidated("/api/example", schema)).rejects.toBeInstanceOf(
      ApiError
    )
  })

  it("throws when JSON does not match the schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ name: 123 }),
      })
    )

    const schema = z.object({ name: z.string() })
    await expect(fetchValidated("/api/example", schema)).rejects.toThrow()
  })
})
