import { readFile } from "node:fs/promises"
import path from "node:path"
import { columnsSchema } from "@/features/loan-applications/schema"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "columns.json")
    const raw = await readFile(filePath, "utf8")
    const columns = columnsSchema.parse(JSON.parse(raw))
    return Response.json(columns, {
      headers: {
        "Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Failed to load columns", error)
    return Response.json({ error: "Failed to load columns" }, { status: 500 })
  }
}
