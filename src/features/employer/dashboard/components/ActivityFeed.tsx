import { Building2, FileText, Briefcase, Users, Calendar, CheckCircle, XCircle, Clock, UserPlus, UserMinus, Mail, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/shared/states/EmptyState"
import PartialError from "@/components/shared/states/PartialError"
import { activityService } from "@/shared/activity/services/activity.service"
import type { Activity } from "@/types/activity.types"
import { useQuery } from "@tanstack/react-query"

const activityIcons: Record<string, any> = {
  user_created: UserPlus,
  user_updated: Users,
  user_deleted: UserMinus,
  company_created: Building2,
  company_updated: Building2,
  company_approved: CheckCircle,
  company_rejected: XCircle,
  company_suspended: Shield,
  job_created: Briefcase,
  job_updated: Briefcase,
  job_published: CheckCircle,
  job_closed: XCircle,
  application_submitted: FileText,
  application_status_changed: FileText,
  interview_scheduled: Calendar,
  interview_completed: CheckCircle,
  test_assigned: FileText,
  test_completed: CheckCircle,
  invitation_sent: Mail,
  invitation_accepted: CheckCircle,
  member_added: UserPlus,
  member_removed: UserMinus,
}

const activityTones: Record<string, string> = {
  user_created: "text-emerald-600 bg-emerald-500/10",
  user_updated: "text-blue-600 bg-blue-500/10",
  user_deleted: "text-red-600 bg-red-500/10",
  company_created: "text-emerald-600 bg-emerald-500/10",
  company_updated: "text-blue-600 bg-blue-500/10",
  company_approved: "text-emerald-600 bg-emerald-500/10",
  company_rejected: "text-red-600 bg-red-500/10",
  company_suspended: "text-amber-600 bg-amber-500/10",
  job_created: "text-emerald-600 bg-emerald-500/10",
  job_updated: "text-blue-600 bg-blue-500/10",
  job_published: "text-emerald-600 bg-emerald-500/10",
  job_closed: "text-red-600 bg-red-500/10",
  application_submitted: "text-blue-600 bg-blue-500/10",
  application_status_changed: "text-amber-600 bg-amber-500/10",
  interview_scheduled: "text-blue-600 bg-blue-500/10",
  interview_completed: "text-emerald-600 bg-emerald-500/10",
  test_assigned: "text-blue-600 bg-blue-500/10",
  test_completed: "text-emerald-600 bg-emerald-500/10",
  invitation_sent: "text-blue-600 bg-blue-500/10",
  invitation_accepted: "text-emerald-600 bg-emerald-500/10",
  member_added: "text-emerald-600 bg-emerald-500/10",
  member_removed: "text-red-600 bg-red-500/10",
}

function formatDate(value: string, locale: string, t: (key: string) => string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return t("justNow")
  if (diffMins < 60) return `${diffMins} ${t("minutesAgo")}`
  if (diffHours < 24) return `${diffHours} ${t("hoursAgo")}`
  if (diffDays < 7) return `${diffDays} ${t("daysAgo")}`

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

interface ActivityFeedProps {
  limit?: number
}

export default function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const { t, i18n } = useTranslation("activity")
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["activity", limit],
    queryFn: () => activityService.getActivity({ per_page: limit }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <PartialError
        message={t("activityLoadError", "Failed to load activity feed.")}
        retry={() => void refetch()}
      />
    )
  }

  if (!data?.data?.length) {
    return (
      <EmptyState
        title={t("noActivity")}
        description={t("noActivityDescription", "No recent activity to display.")}
        icon={Clock}
        className="py-8 bg-transparent"
      />
    )
  }

  return (
    <div className="divide-y divide-border">
      {data.data.map((activity: Activity) => {
        const Icon = activityIcons[activity.type] || Clock
        const tone = activityTones[activity.type] || "text-gray-600 bg-gray-500/10"

        return (
          <div key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`rounded-lg p-2 ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{activity.title}</p>
              <p className="mt-0.5 text-xs text-text-muted">{activity.description}</p>
              {activity.actor && (
                <p className="mt-1 text-xs text-text-muted">
                  by {activity.actor.name}
                </p>
              )}
            </div>
            <time className="shrink-0 text-xs text-text-muted">
              {formatDate(activity.timestamp, i18n.language, t)}
            </time>
          </div>
        )
      })}
    </div>
  )
}
