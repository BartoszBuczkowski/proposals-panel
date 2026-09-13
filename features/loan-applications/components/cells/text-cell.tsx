export function TextCell({ value }: { value: unknown }) {
  if (value == null || value === "") {
    return <span className="text-muted-foreground">—</span>
  }

  return <span>{String(value)}</span>
}
