import { readFile } from "node:fs/promises"
import path from "node:path"
import { columnsSchema } from "../schema"
import type { ColumnMetadata } from "../types"

export async function readColumns(): Promise<ColumnMetadata[]> {
  const filePath = path.join(process.cwd(), "data", "columns.json")
  const raw = await readFile(filePath, "utf8")
  return columnsSchema.parse(JSON.parse(raw))
}
