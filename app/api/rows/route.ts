import { readFile } from "node:fs/promises"
import path from "node:path"
import { loanApplicationsSchema } from "@/features/loan-applications/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("error") === "1") {
    return Response.json({ error: "Simulated rows failure" }, { status: 500 })
  }

  try {
    const filePath = path.join(process.cwd(), "data", "rows.json")
    const raw = await readFile(filePath, "utf8")
    const rows = loanApplicationsSchema.parse(JSON.parse(raw))
    return Response.json(rows)
  } catch (error) {
    console.error("Failed to load rows", error)
    return Response.json({ error: "Failed to load rows" }, { status: 500 })
  }
}
