import { CircleAlert, ServerCog } from "lucide-react"
import { useTranslation } from "react-i18next"

interface AdminApiCoverageNoticeProps {
  failedSources: string[]
}

export default function AdminApiCoverageNotice({ failedSources }: AdminApiCoverageNoticeProps) {
  const { t } = useTranslation("adminDashboard")
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {failedSources.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-text-secondary">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <p>
            <span className="font-semibold text-text-primary">{t("partialTitle")}</span>{" "}
            {t("partialDescription", { sources: failedSources.join(", ") })}
          </p>
        </div>
      )}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-text-secondary">
        <ServerCog className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-semibold text-text-primary">{t("coverageTitle")}</span>{" "}
          {t("coverageDescription")}
        </p>
      </div>
    </div>
  )
}
