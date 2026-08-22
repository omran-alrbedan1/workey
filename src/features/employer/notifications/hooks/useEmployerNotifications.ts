import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerNotificationsService } from "../services/employerNotifications.service"

export function useEmployerNotifications() {
  const { t, i18n } = useTranslation("employerNotifications")
  const client = useQueryClient()
  const [page, setPage] = useState(1)
  const rootKey = ["employer", "notifications"] as const
  const adminRootKey = ["admin", "notifications"] as const

  const listQuery = useQuery({
    queryKey: [...rootKey, "list", i18n.resolvedLanguage, page],
    queryFn: () => employerNotificationsService.list(page),
    placeholderData: keepPreviousData,
  })

  const unreadCountQuery = useQuery({
    queryKey: [...rootKey, "unreadCount", i18n.resolvedLanguage],
    queryFn: () => employerNotificationsService.getUnreadCount(),
    refetchInterval: 30_000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string | number) => employerNotificationsService.markRead(id),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: rootKey }),
        client.invalidateQueries({ queryKey: adminRootKey }),
      ])
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => employerNotificationsService.markAllRead(),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: rootKey }),
        client.invalidateQueries({ queryKey: adminRootKey }),
      ])
      showSuccessToast(t("toasts.allRead"))
    },
  })

  return {
    ...listQuery,
    unreadCount: unreadCountQuery.data?.unread_count ?? unreadCountQuery.data?.count ?? 0,
    isUnreadCountPending: unreadCountQuery.isPending,
    markReadMutation,
    markAllReadMutation,
    page,
    setPage,
  }
}
