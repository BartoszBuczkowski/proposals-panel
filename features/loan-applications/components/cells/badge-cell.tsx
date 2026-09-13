import { Badge } from "@/components/ui/badge"

export function BadgeCell({ value }: { value: unknown }) {
  if (value == null || value === "") {
    return <span className="text-muted-foreground">—</span>
  }

  return <Badge variant="secondary">{String(value)}</Badge>
}
