import type {
  FieldPath,
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form"

function firstValidationMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstValidationMessage(item)
      if (message) return message
    }
  }
  return undefined
}

export function applyApiValidationErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  error: unknown,
): boolean {
  if (typeof error !== "object" || error === null || !("errors" in error)) return false

  const errors = (error as { errors?: unknown }).errors
  if (typeof errors !== "object" || errors === null) return false

  let applied = false

  for (const [field, value] of Object.entries(errors as Record<string, unknown>)) {
    const message = firstValidationMessage(value)
    if (!message) continue

    setError(field as Path<TFieldValues>, {
      type: "server",
      message,
    })
    applied = true
  }

  return applied
}

export function rootFormError<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  message: string,
) {
  setError("root" as FieldPath<TFieldValues>, {
    type: "server",
    message,
  })
}
