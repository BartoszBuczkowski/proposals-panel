import { formatCurrencyValue } from "../../functions/sort-value"

export function CurrencyCell({ value }: { value: unknown }) {
  return <span className="tabular-nums">{formatCurrencyValue(value)}</span>
}
