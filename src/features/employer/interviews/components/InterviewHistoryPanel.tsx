import { useQuery } from "@tanstack/react-query"
import { CalendarClock, History, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { valueOf } from "@/lib/keyValue"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type {
  EmployerInterviewHistoryItem,
  EmployerInterviewScheduleHistoryItem,
} from "../types/employerInterviews.types"

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function actorName(actor?: { name?: string }) {
  return actor?.name || "-"
}

function StatusHistoryList({ items }: { items: EmployerInterviewHistoryItem[] }) {
  const { t } = useTranslation("employerInterviews")
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">{t("history.empty")}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-border p-3">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="text-sm font-medium">
              {valueOf(item.from_status, "-")} {"->"} {valueOf(item.to_status ?? item.status, "-")}
            </p>
            <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
          </div>
          {item.reason && <p className="mt-2 text-sm text-text-muted">{item.reason}</p>}
          <p className="mt-1 text-xs text-text-muted">
            {t("history.actor", { actor: actorName(item.actor) })}
          </p>
        </div>
      ))}
    </div>
  )
}

function ScheduleHistoryList({ items }: { items: EmployerInterviewScheduleHistoryItem[] }) {
  const { t } = useTranslation("employerInterviews")
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">{t("history.empty")}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-border p-3">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="text-sm font-medium">
              {formatDateTime(item.scheduled_start_at)} - {formatDateTime(item.scheduled_end_at)}
            </p>
            <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {item.mode || "-"} · {item.meeting_link || item.location_text || "-"}
          </p>
          {item.reason && <p className="mt-2 text-sm text-text-muted">{item.reason}</p>}
          <p className="mt-1 text-xs text-text-muted">
            {t("history.actor", { actor: actorName(item.actor) })}
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
          <Button type="button" variant="ghost" size="sm" onClick={() => void statusHistory.refetch()}>
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
          <Button type="button" variant="ghost" size="sm" onClick={() => void scheduleHistory.refetch()}>
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
