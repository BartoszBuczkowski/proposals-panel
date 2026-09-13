export function compareNullableNumbers(
  left: number | null | undefined,
  right: number | null | undefined
): number {
  const leftMissing = left == null || Number.isNaN(left)
  const rightMissing = right == null || Number.isNaN(right)

  if (leftMissing && rightMissing) return 0
  if (leftMissing) return 1
  if (rightMissing) return -1
  return left - right
}

export function compareNullableDates(
  left: string | null | undefined,
  right: string | null | undefined
): number {
  const leftTime = left ? Date.parse(left) : Number.NaN
  const rightTime = right ? Date.parse(right) : Number.NaN
  const leftMissing = Number.isNaN(leftTime)
  const rightMissing = Number.isNaN(rightTime)

  if (leftMissing && rightMissing) return 0
  if (leftMissing) return 1
  if (rightMissing) return -1
  return leftTime - rightTime
}

export function compareNullableText(
  left: string | null | undefined,
  right: string | null | undefined
): number {
  const leftMissing = left == null || left === ""
  const rightMissing = right == null || right === ""

  if (leftMissing && rightMissing) return 0
  if (leftMissing) return 1
  if (rightMissing) return -1
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

export function formatCurrencyValue(value: unknown): string {
  if (value == null || value === "") {
    return "—"
  }

  const amount = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(amount)) {
    return "—"
  }

  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return `¤ ${formatted}`
}

export function formatDateValue(value: unknown): string {
  if (value == null || value === "") {
    return "—"
  }

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
