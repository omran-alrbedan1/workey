import { useQuery } from "@tanstack/react-query"
import { CalendarClock, History, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/shared/states/EmptyState"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type {
  EmployerInterviewHistoryItem,
  EmployerInterviewScheduleHistoryItem,
} from "../types/employerInterviews.types"
import { interviewValue } from "../utils/interviewDisplay"

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function actorName(actor?: { name?: string }) {
  return actor?.name || "-"
}

function formatMetadata(metadata?: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) return null
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" | ")
}

function StatusHistoryList({ items }: { items: EmployerInterviewHistoryItem[] }) {
  const { t } = useTranslation("employerInterviews")
  if (items.length === 0) {
    return (
      <EmptyState
        title={t("history.empty")}
        description={t("history.statusTitle")}
        icon={History}
        className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
      />
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const metadata = formatMetadata(item.metadata)
        return (
          <div key={item.id} className="rounded-md border border-border p-3">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="text-sm font-medium">
                {interviewValue(item.from_status)} {"->"} {interviewValue(item.to_status)}
              </p>
              <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
            </div>
            {item.reason && <p className="mt-2 text-sm text-text-muted">{item.reason}</p>}
            {metadata && <p className="mt-1 text-xs text-text-muted">{metadata}</p>}
            <p className="mt-1 text-xs text-text-muted">
              {t("history.actor", { actor: actorName(item.changed_by) })}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function ScheduleHistoryList({ items }: { items: EmployerInterviewScheduleHistoryItem[] }) {
  const { t } = useTranslation("employerInterviews")
  if (items.length === 0) {
    return (
      <EmptyState
        title={t("history.empty")}
        description={t("history.scheduleTitle")}
        icon={CalendarClock}
        className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
      />
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-border p-3">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="text-sm font-medium">
              {formatDateTime(item.previous_start_at)} - {formatDateTime(item.previous_end_at)}
              {" -> "}
              {formatDateTime(item.new_start_at)} - {formatDateTime(item.new_end_at)}
            </p>
            <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {interviewValue(item.previous_mode)} {"->"} {interviewValue(item.new_mode)}
            {" | "}
            {item.previous_meeting_link || item.previous_location_text || "-"}
            {" -> "}
            {item.new_meeting_link || item.new_location_text || "-"}
          </p>
          {item.reason && <p className="mt-2 text-sm text-text-muted">{item.reason}</p>}
          <p className="mt-1 text-xs text-text-muted">
            {t("history.actor", { actor: actorName(item.changed_by) })}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function InterviewHistoryPanel({ interviewId }: { interviewId: string | number }) {
  const { t } = useTranslation("employerInterviews")
  const statusHistory = useQuery({
    queryKey: ["employer", "interviews", String(interviewId), "status-history"],
    queryFn: () => employerInterviewsService.getStatusHistory(interviewId),
  })
  const scheduleHistory = useQuery({
    queryKey: ["employer", "interviews", String(interviewId), "schedule-history"],
    queryFn: () => employerInterviewsService.getScheduleHistory(interviewId),
  })

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            {t("history.statusTitle")}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void statusHistory.refetch()}
          >
            <RotateCcw className="h-4 w-4" />
            {t("history.refresh")}
          </Button>
        </CardHeader>
        <CardContent>
          {statusHistory.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : statusHistory.isError ? (
            <p className="text-sm text-red-600">{t("history.loadError")}</p>
          ) : (
            <StatusHistoryList items={statusHistory.data?.items ?? []} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-primary" />
            {t("history.scheduleTitle")}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void scheduleHistory.refetch()}
          >
            <RotateCcw className="h-4 w-4" />
            {t("history.refresh")}
          </Button>
        </CardHeader>
        <CardContent>
          {scheduleHistory.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : scheduleHistory.isError ? (
            <p className="text-sm text-red-600">{t("history.loadError")}</p>
          ) : (
            <ScheduleHistoryList items={scheduleHistory.data?.items ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
