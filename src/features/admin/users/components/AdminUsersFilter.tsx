import { Search, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CustomFilter, type FilterField } from "@/components/shared/custom/CustomFilter"
import {
  ADMIN_USER_FILTER_DEFAULTS,
  type AdminUserFilterForm,
} from "../types/adminUsers.types"

interface AdminUsersFilterProps {
  onApplyFilters: (values: Partial<AdminUserFilterForm>) => void
  onResetFilters: () => void
  isLoading: boolean
  initialFilters: Partial<AdminUserFilterForm>
}

export default function AdminUsersFilter({
  onApplyFilters,
  onResetFilters,
  isLoading,
  initialFilters,
}: AdminUsersFilterProps) {
  const { t } = useTranslation("adminUsers")
  const fields: FilterField<AdminUserFilterForm>[] = [
    {
      name: "search",
      label: t("filters.searchLabel"),
      type: "text",
      placeholder: t("filters.searchPlaceholder"),
      icon: Search,
      minWidth: "240px",
    },
    {
      name: "status",
      label: t("filters.statusLabel"),
      type: "select",
      icon: ShieldCheck,
      emptyValue: "all",
      options: [
        { value: "all", label: t("filters.allStatuses") },
        { value: "active", label: t("statuses.active") },
        { value: "suspended", label: t("statuses.suspended") },
      ],
    },
  ]

  return (
    <CustomFilter<AdminUserFilterForm>
      title={t("filters.title")}
      filters={fields}
      defaultValues={ADMIN_USER_FILTER_DEFAULTS}
      initialFilters={initialFilters}
      onApplyFilters={onApplyFilters}
      onResetFilters={onResetFilters}
      isLoading={isLoading}
    />
  )
}
