import { Calendar, Video, CalendarPlus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { valueOf } from "@/lib/keyValue"
import EmptyState from "@/components/shared/states/EmptyState"
import type { EmployerInterview } from "@/features/employer/interviews/types/employerInterviews.types"

interface InterviewsTabProps {
  interviews: {
    isPending: boolean
    data?: { items: EmployerInterview[] }
  }
  onSchedule: () => void
}

export default function InterviewsTab({ interviews, onSchedule }: InterviewsTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (interviews.isPending) {
    return <Skeleton className="h-64 w-full" />
  }

  if (!interviews.data?.items || interviews.data.items.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5 text-primary" />
            {t("interview.title")}
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={onSchedule} className="shrink-0">
            <Calendar className="h-4 w-4 mr-2" /> {t("interview.schedule")}
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t("interview.empty")}
            description={t("interview.emptyDescription", { defaultValue: "No interviews are scheduled for this application." })}
            icon={Video}
            primaryAction={{
              label: t("interview.schedule"),
              onClick: onSchedule,
              icon: CalendarPlus,
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-5 w-5 text-primary" />
          {t("interview.title")}
        </CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={onSchedule} className="shrink-0">
          <Calendar className="h-4 w-4 mr-2" /> {t("interview.schedule")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {interviews.data.items.slice(0, 5).map((interview) => {
          const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null

          return (
            <div key={interview.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {String(interview.type || "Interview")}
                </p>
                <div className="mt-1 flex items-center gap-4 text-xs text-text-muted">
                  {scheduledDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {scheduledDate.toLocaleString()}
                    </span>
                  )}
                  {interview.duration_minutes && (
                    <span>{interview.duration_minutes} min</span>
                  )}
                </div>
              </div>
              <Badge variant="secondary">
                {String(valueOf(interview.status) || "scheduled")}
              </Badge>
            </div>
          )
        })}
        {interviews.data.items.length > 5 && (
          <p className="text-center text-xs text-text-muted">
            {t("interview.moreCount", { count: interviews.data.items.length - 5 })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
