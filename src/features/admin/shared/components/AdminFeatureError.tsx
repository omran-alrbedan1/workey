import ErrorState from "@/components/shared/states/ErrorState"
import { useTranslation } from "react-i18next"

export default function AdminFeatureError({
  title,
  error,
  retry,
}: {
  title: string
  error?: unknown
  retry: () => void
}) {
  const { t } = useTranslation("adminShared")
  return (
    <ErrorState
      variant="network"
      title={t("errors.unableToLoad", { resource: title })}
      description={t("errors.description")}
      error={error instanceof Error ? error : undefined}
      retry={retry}
      className="min-h-96"
    />
  )
}
