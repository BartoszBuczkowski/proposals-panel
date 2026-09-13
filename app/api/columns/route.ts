import { readColumns } from "@/features/loan-applications/functions/read-columns"

export async function GET() {
  try {
    const columns = await readColumns()
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
