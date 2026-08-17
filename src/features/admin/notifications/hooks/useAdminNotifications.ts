import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { adminNotificationsService } from "../services/adminNotifications.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
const root = ["admin", "notifications"] as const
const employerRoot = ["employer", "notifications"] as const
export function useAdminNotifications() {
  const { t } = useTranslation("adminNotifications")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const listQuery = useQuery({
    queryKey: [...root, page],
    queryFn: () => adminNotificationsService.list(page),
  })
  const unreadQuery = useQuery({
    queryKey: [...root, "unread"],
    queryFn: adminNotificationsService.unreadCount,
  })
  const markReadMutation = useMutation({
    mutationFn: adminNotificationsService.markRead,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: root, refetchType: "active" }),
        client.invalidateQueries({ queryKey: employerRoot, refetchType: "active" }),
      ])
      showSuccessToast(t("markedRead"))
    },
  })
  const markAllReadMutation = useMutation({
    mutationFn: adminNotificationsService.markAllRead,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: root, refetchType: "active" }),
        client.invalidateQueries({ queryKey: employerRoot, refetchType: "active" }),
      ])
      showSuccessToast(t("markedAllRead"))
    },
  })
  return {
    ...listQuery,
    page,
    setPage,
    unreadCount: unreadQuery.data ?? 0,
    markReadMutation,
    markAllReadMutation,
  }
}
