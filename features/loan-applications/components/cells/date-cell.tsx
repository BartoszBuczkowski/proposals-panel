import { formatDateValue } from "../../functions/sort-value"

export function DateCell({ value }: { value: unknown }) {
  return <span>{formatDateValue(value)}</span>
}
