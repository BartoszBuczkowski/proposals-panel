import { z } from "zod"
import { ApiError } from "./errors"

export async function fetchValidated<TSchema extends z.ZodType>(
  url: string,
  schema: TSchema,
  init?: RequestInit
): Promise<z.infer<TSchema>> {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    )
  }

  const json: unknown = await response.json()
  return schema.parse(json)
}
