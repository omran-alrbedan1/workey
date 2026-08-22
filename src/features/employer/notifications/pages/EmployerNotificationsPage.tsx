import { Bell } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import EmployerNotificationsTable from "../components/EmployerNotificationsTable"
import { useEmployerNotifications } from "../hooks/useEmployerNotifications"
import { useNavigate } from "react-router-dom"
import {
  isNotificationUnread,
  resolveNotificationTarget,
} from "@/shared/notifications/notification.utils"
import type { EmployerNotification } from "../types/employerNotifications.types"

export default function EmployerNotificationsPage() {
  const { t } = useTranslation("employerNotifications")
  const navigate = useNavigate()
  const {
    data,
    isPending,
    isError,
    refetch,
    unreadCount,
    markReadMutation,
    markAllReadMutation,
    setPage,
  } = useEmployerNotifications()

  const openNotification = (notification: EmployerNotification) => {
    if (isNotificationUnread(notification)) {
      markReadMutation.mutate(notification.id)
    }

    const target = resolveNotificationTarget(notification, "employer")
    if (target) navigate(target)
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("title")} description={t("description")} icon={Bell} />
        <ErrorState
          title={t("errors.title")}
          description={t("errors.description")}
          retry={() => void refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={Bell}
        count={unreadCount}
      />
      {isPending ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (
        <EmployerNotificationsTable
          collection={data}
          isLoading={false}
          isMarking={markReadMutation.isPending || markAllReadMutation.isPending}
          unreadCount={unreadCount}
          onMarkRead={(id) => markReadMutation.mutate(id)}
          onMarkAllRead={() => markAllReadMutation.mutate()}
          onOpen={openNotification}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
