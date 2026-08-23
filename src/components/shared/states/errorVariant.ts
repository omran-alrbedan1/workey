import type { ErrorVariant } from "./ErrorState"

export function resolveErrorVariant(error: unknown): ErrorVariant {
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode?: number }).statusCode
      : undefined

  if (statusCode === 401) return "401"
  if (statusCode === 403) return "403"
  if (statusCode === 404) return "404"
  if (statusCode === 422) return "422"
  if (typeof statusCode === "number" && statusCode >= 500) return "500"

  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : error instanceof Error
        ? error.message
        : ""

  if (message.toLowerCase().includes("timeout")) return "timeout"
  return "network"
}
