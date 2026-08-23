import { CalendarSync, History } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import {
  interviewValue,
} from "../utils/interviewDisplay"
import type {
  EmployerInterviewHistoryItem,
  EmployerInterviewScheduleHistoryItem,
} from "../types/employerInterviews.types"

interface InterviewHistoryFromResponseProps {
  isRtl: boolean
  statusHistory: EmployerInterviewHistoryItem[]
  scheduleHistory: EmployerInterviewScheduleHistoryItem[]
}

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

export default function InterviewHistoryFromResponse({
  isRtl,
  statusHistory,
  scheduleHistory,
}: InterviewHistoryFromResponseProps) {
  const { t } = useTranslation("employerInterviews")

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {statusHistory.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
          <h3
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-text-primary",
              isRtl && "flex-row-reverse text-end",
            )}
          >
            <History className="h-4 w-4 text-primary" />
            {t("history.statusTitle")}
          </h3>
          {statusHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  isRtl && "flex-row-reverse text-end",
                )}
              >
                <p className="text-sm font-medium text-text-primary">
                  {interviewValue(item.from_status)} {"->"} {interviewValue(item.to_status)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              {item.reason && (
                <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-end")}>
                  {item.reason}
                </p>
              )}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {t("history.actor", { actor: item.changed_by.name })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {scheduleHistory.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
          <h3
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-text-primary",
              isRtl && "flex-row-reverse text-end",
            )}
          >
            <CalendarSync className="h-4 w-4 text-primary" />
            {t("history.scheduleTitle")}
          </h3>
          {scheduleHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  isRtl && "flex-row-reverse text-end",
                )}
              >
                <p className="text-sm font-medium text-text-primary">
                  {formatDateTime(item.previous_start_at)} {"->"}{" "}
                  {formatDateTime(item.new_start_at)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                {interviewValue(item.previous_mode)} {"->"} {interviewValue(item.new_mode)}
              </p>
              {(item.previous_meeting_link ||
                item.previous_location_text ||
                item.new_meeting_link ||
                item.new_location_text) && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {item.previous_meeting_link || item.previous_location_text || "-"} {"->"}{" "}
                  {item.new_meeting_link || item.new_location_text || "-"}
                </p>
              )}
              {item.reason && (
                <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-end")}>
                  {item.reason}
                </p>
              )}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {t("history.actor", { actor: item.changed_by.name })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
