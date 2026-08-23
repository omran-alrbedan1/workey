import ErrorState from "@/components/shared/states/ErrorState"
import { resolveErrorVariant } from "@/components/shared/states/errorVariant"
import { useTranslation } from "react-i18next"

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
      variant={resolveErrorVariant(error)}
      title={t("errors.unableToLoad", { resource: title })}
      description={t("errors.description")}
      error={error instanceof Error ? error : undefined}
      retry={retry}
      className="min-h-96"
    />
  )
}
