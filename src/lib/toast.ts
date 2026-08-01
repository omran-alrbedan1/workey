import { toast } from "sonner"

type ErrorLike = {
  message?: string
  errors?: Record<string, string[]>
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (typeof error === "string" && error.trim()) return error
  if (error instanceof Error && error.message) return error.message

  if (typeof error === "object" && error !== null) {
    const value = error as ErrorLike
    if (value.errors) {
      const validationMessage = Object.values(value.errors).flat().find(Boolean)
      if (validationMessage) return validationMessage
    }
    if (value.message) return value.message
  }

  return fallback
}

export function showErrorToast(error: unknown, fallback?: string) {
  const message = getErrorMessage(error, fallback)
  return toast.error(message, { id: `error:${message}` })
}

export function showSuccessToast(message: string, description?: string) {
  return toast.success(message, description ? { description } : undefined)
}
