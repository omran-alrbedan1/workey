import { Circle, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export type DataSourceStatus = "live" | "partial" | "unavailable" | "stale"

export interface DataSource {
  label: string
  status: DataSourceStatus
}

interface DataSourceIndicatorProps {
  sources: DataSource[]
  onRefresh?: () => void
  isRefreshing?: boolean
  className?: string
}

const statusConfig: Record<DataSourceStatus, { color: string; labelKey: string }> = {
  live: {
    color: "text-emerald-500",
    labelKey: "live",
  },
  partial: {
    color: "text-amber-500",
    labelKey: "partial",
  },
  unavailable: {
    color: "text-rose-500",
    labelKey: "unavailable",
  },
  stale: {
    color: "text-text-muted",
    labelKey: "stale",
  },
}

function StatusDot({ status }: { status: DataSourceStatus }) {
  return <Circle className={cn("h-2 w-2 fill-current", statusConfig[status].color)} />
}

export default function DataSourceIndicator({
  sources,
  onRefresh,
  isRefreshing = false,
  className,
}: DataSourceIndicatorProps) {
  const { t } = useTranslation("common")

  if (sources.length === 0) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-background-card px-3 py-2 text-xs text-text-secondary shadow-sm",
        className,
      )}
    >
      <span className="font-medium text-text-muted">{t("dataSource.title", "Data sources:")}</span>
      {sources.map((source) => (
        <span key={source.label} className="inline-flex items-center gap-1.5">
          <StatusDot status={source.status} />
          <span>{source.label}</span>
          <span className="text-text-muted">
            ({t(`dataSource.${statusConfig[source.status].labelKey}`)})
          </span>
        </span>
      ))}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="ms-auto inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          {t("refresh")}
        </button>
      )}
    </div>
  )
}
