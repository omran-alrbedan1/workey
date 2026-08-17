import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import { showSuccessToast } from "@/lib/toast"

import { adminUsersKeys } from "./useAdminUsers"
import { adminUsersService } from "../services/adminUsers.service"
import type {
  AdminUserDetails,
  AdminUserRecord,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
} from "../types/adminUsers.types"

const detailsKey = (id: string | number) => ["admin", "users", "details", String(id)] as const

function mapRecordToDetails(user: AdminUserRecord): AdminUserDetails {
  return {
    ...user,
  }
}

export function useAdminUserDetails(id?: string) {
  const { t } = useTranslation("adminUsers")
  const client = useQueryClient()

  const fallbackUser = useMemo(() => {
    if (!id) return null
    const queries = client.getQueriesData<AdminCollection<AdminUserRecord>>({
      queryKey: adminUsersKeys.all,
    })

    for (const [, data] of queries) {
      const found = data?.items?.find((user) => String(user.id) === String(id))
      if (found) return mapRecordToDetails(found)
    }
    return null
  }, [client, id])

  const query = useQuery({
    queryKey: detailsKey(id ?? "missing"),
    queryFn: () => adminUsersService.get(id as string),
    enabled: Boolean(id),
    retry: false,
  })

  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: adminUsersKeys.all }),
      client.invalidateQueries({ queryKey: detailsKey(id ?? "missing") }),
    ])
  }

  const statusMutation = useMutation({
    mutationFn: (input: UpdateUserStatusInput) =>
      input.status === "active"
        ? adminUsersService.activate(input.id)
        : adminUsersService.suspend(input.id, input.reason),
    onSuccess: async (_, input) => {
      await refresh()
      showSuccessToast(t(input.status === "active" ? "toasts.activated" : "toasts.suspended"))
    },
  })

  const roleMutation = useMutation({
    mutationFn: (input: UpdateUserRoleInput) => adminUsersService.updateRole(input),
    onSuccess: async (_, input) => {
      await refresh()
      showSuccessToast(
        t("toasts.roleUpdated"),
        t("toasts.roleUpdatedDescription", { role: input.role }),
      )
    },
  })

  const hasOperationalCoverage = Boolean(
    query.data &&
    (query.data.activity_logs !== undefined ||
      query.data.audit_logs !== undefined ||
      query.data.login_history !== undefined ||
      query.data.active_sessions !== undefined ||
      query.data.applications !== undefined ||
      query.data.jobs !== undefined ||
      query.data.interviews !== undefined ||
      query.data.tests !== undefined ||
      query.data.counts !== undefined),
  )

  return {
    ...query,
    user: query.data ?? fallbackUser,
    hasFallbackData: Boolean(fallbackUser),
    isBackendCoverageMissing:
      (query.isError && Boolean(fallbackUser)) || (Boolean(query.data) && !hasOperationalCoverage),
    statusMutation,
    roleMutation,
  }
}
