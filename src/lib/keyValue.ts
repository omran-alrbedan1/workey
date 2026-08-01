export type KeyValueLike = {
  key?: string | number | null
  value?: string | number | null
  label?: string | number | null
  name?: string | number | null
}

export type KeyValueField = string | number | KeyValueLike | null | undefined

export function keyOf(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const record = value as KeyValueLike
    if (record.key !== undefined && record.key !== null) return String(record.key)
  }
  return fallback
}

export function valueOf(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const record = value as KeyValueLike
    const displayValue = record.value ?? record.label ?? record.name ?? record.key
    if (displayValue !== undefined && displayValue !== null) return String(displayValue)
  }
  return fallback
}
