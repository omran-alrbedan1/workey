import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { notificationsService } from "../notifications.service"

export function useNotificationUnreadCount(scope: "admin" | "employer") {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: [scope, "notifications", "unreadCount", i18n.resolvedLanguage],
    queryFn: notificationsService.unreadCount,
    refetchInterval: 30_000,
  })
}
