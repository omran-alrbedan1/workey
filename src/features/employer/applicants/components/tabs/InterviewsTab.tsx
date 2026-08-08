import { Calendar, Video } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { valueOf } from "@/lib/keyValue"
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Video className="h-5 w-5 text-primary" />
            {t("interviews.title")}
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={onSchedule}>
            <Calendar className="h-4 w-4" /> {t("interviews.schedule")}
          </Button>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
          {t("interviews.empty")}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Video className="h-5 w-5 text-primary" />
          {t("interviews.title")}
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onSchedule}>
          <Calendar className="h-4 w-4" /> {t("interviews.schedule")}
        </Button>
      </div>

      <div className="space-y-2">
        {interviews.data.items.slice(0, 5).map((interview) => {
          const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null

          return (
            <div key={interview.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {interview.type || t("interviews.defaultType")}
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
                {valueOf(interview.status, "scheduled")}
              </Badge>
            </div>
          )
        })}
        {interviews.data.items.length > 5 && (
          <p className="text-center text-xs text-text-muted">
            {t("interviews.moreCount", { count: interviews.data.items.length - 5 })}
          </p>
        )}
      </div>
    </div>
  )
}
