import ErrorState, { type ErrorVariant } from "@/components/shared/states/ErrorState"
import { useTranslation } from "react-i18next"

function variantFor(error: unknown): ErrorVariant {
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode?: number }).statusCode
      : undefined

  if (statusCode === 403) return "403"
  if (statusCode === 404) return "404"
  if (statusCode && statusCode >= 500) return "500"

  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : error instanceof Error
        ? error.message
        : ""

  if (message.toLowerCase().includes("timeout")) return "timeout"
  return "network"
}

export default function EmployerFeatureError({
  title,
  error,
  retry,
}: {
  title: string
  error?: unknown
  retry: () => void
}) {
  const { t } = useTranslation("employerShared")
  return (
    <ErrorState
      variant={variantFor(error)}
      title={t("errors.unableToLoad", { resource: title })}
      description={t("errors.description")}
      error={error instanceof Error ? error : undefined}
      retry={retry}
      className="min-h-96"
    />
  )
}
