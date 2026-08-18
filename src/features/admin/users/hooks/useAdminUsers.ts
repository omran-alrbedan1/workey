import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { adminUsersService } from "../services/adminUsers.service"
import { showSuccessToast } from "@/lib/toast"
import {
  ADMIN_USER_FILTER_DEFAULTS,
  type AdminUserFilterForm,
} from "../types/adminUsers.types"

const adminUsersPageSize = 10

export const adminUsersKeys = {
  all: ["admin", "users"] as const,
  list: (page: number, filters: AdminUserFilterForm) =>
    ["admin", "users", { page, filters }] as const,
}

const asApiValue = (value?: string) => {
  const normalized = value?.trim()
  return normalized && normalized !== "all" ? normalized : undefined
}

export function useAdminUsers(filters: AdminUserFilterForm | string = ADMIN_USER_FILTER_DEFAULTS) {
  const { t } = useTranslation("adminUsers")
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const filterValues =
    typeof filters === "string"
      ? { ...ADMIN_USER_FILTER_DEFAULTS, role: filters }
      : filters
  const normalizedFilters = useMemo(
    () => ({
      search: typeof filterValues.search === "string" ? filterValues.search.trim() : "",
      role: filterValues.role || "all",
      status: filterValues.status || "all",
    }),
    [filterValues.role, filterValues.search, filterValues.status],
  )

  useEffect(() => {
    setPage(1)
  }, [normalizedFilters])

  const query = useQuery({
    queryKey: adminUsersKeys.list(page, normalizedFilters),
    queryFn: () =>
      adminUsersService.list({
        page,
        per_page: adminUsersPageSize,
        search: asApiValue(normalizedFilters.search),
        role: asApiValue(normalizedFilters.role),
        status: asApiValue(normalizedFilters.status),
      }),
    placeholderData: keepPreviousData,
  })
  const refreshUsers = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all, refetchType: "active" }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "users"],
        refetchType: "active",
      }),
    ])
  const statusMutation = useMutation({
    mutationFn: (input: { id: string | number; status: "active" | "suspended"; reason?: string }) =>
      input.status === "active"
        ? adminUsersService.activate(input.id)
        : adminUsersService.suspend(input.id, input.reason),
    onSuccess: async (_, input) => {
      await refreshUsers()
      showSuccessToast(t(input.status === "active" ? "toasts.activated" : "toasts.suspended"))
    },
  })
  const roleMutation = useMutation({
    mutationFn: adminUsersService.updateRole,
    onSuccess: async (_, input) => {
      await refreshUsers()
      showSuccessToast(
        t("toasts.roleUpdated"),
        t("toasts.roleUpdatedDescription", { role: input.role }),
      )
    },
  })

  return { ...query, page, setPage, statusMutation, roleMutation }
}
