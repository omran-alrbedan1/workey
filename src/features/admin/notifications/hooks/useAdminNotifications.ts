import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { adminNotificationsService } from "../services/adminNotifications.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
const root = ["admin", "notifications"] as const
const employerRoot = ["employer", "notifications"] as const
export function useAdminNotifications() {
  const { t, i18n } = useTranslation("adminNotifications")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const listQuery = useQuery({
    queryKey: [...root, "list", i18n.resolvedLanguage, page],
    queryFn: () => adminNotificationsService.list(page),
    placeholderData: keepPreviousData,
  })
  const unreadQuery = useQuery({
    queryKey: [...root, "unreadCount", i18n.resolvedLanguage],
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
  const deleteMutation = useMutation({
    mutationFn: adminNotificationsService.delete,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: root, refetchType: "active" }),
        client.invalidateQueries({ queryKey: employerRoot, refetchType: "active" }),
      ])
      showSuccessToast(t("deleted"))
    },
  })
  return {
    ...listQuery,
    page,
    setPage,
    unreadCount: unreadQuery.data ?? 0,
    markReadMutation,
    markAllReadMutation,
    deleteMutation,
  }
}
