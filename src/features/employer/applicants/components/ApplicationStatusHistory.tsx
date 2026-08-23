import { useTranslation } from "react-i18next"
import { Clock, User, ArrowRight } from "lucide-react"
import { keyOf, valueOf } from "@/lib/keyValue"
import { StatusBadge } from "@/components/shared/badges"
import EmptyState from "@/components/shared/states/EmptyState"
import type { ApplicationStatusHistoryEntry } from "../types/employerApplicants.types"

interface ApplicationStatusHistoryProps {
  history: ApplicationStatusHistoryEntry[]
}

export default function ApplicationStatusHistory({ history }: ApplicationStatusHistoryProps) {
  const { t } = useTranslation("employerApplicants")

  if (!history || history.length === 0) {
    return (
      <EmptyState
        title={t("statusHistory.empty")}
        description={t("statusHistory.title")}
        icon={Clock}
        className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
      />
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{t("statusHistory.title")}</h3>
      <div className="space-y-3">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="relative pb-6 ps-8 last:pb-0 before:absolute before:top-0 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden ltr:before:left-2 rtl:before:right-2"
          >
            <div className="absolute top-0 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background ltr:left-0 rtl:right-0">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {entry.from_status && (
                  <>
                    <StatusBadge
                      status={keyOf(entry.from_status)}
                      label={valueOf(entry.from_status)}
                      variant="soft"
                      className="text-xs"
                    />
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                  </>
                )}
                <StatusBadge
                  status={keyOf(entry.to_status)}
                  label={valueOf(entry.to_status)}
                  variant="soft"
                  className="text-xs"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(entry.changed_at).toLocaleString()}</span>
                </div>
                {entry.changed_by && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{valueOf(entry.changed_by.name) || "Unknown"}</span>
                    {entry.changed_by.role && (
                      <span className="text-text-muted">({valueOf(entry.changed_by.role)})</span>
                    )}
                  </div>
                )}
              </div>
              {entry.note && (
                <div className="rounded-md bg-background border border-border p-2 text-sm text-text-secondary">
                  {entry.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
