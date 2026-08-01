import { Search, Boxes, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CustomFilter, type FilterField } from "@/components/shared/custom/CustomFilter"
import type { AdminAuditLogFilters } from "../types/adminAuditLogs.types"

interface AdminAuditLogsFilterProps {
  filters: AdminAuditLogFilters
  onApply: (filters: AdminAuditLogFilters) => void
  onReset: () => void
}

const defaultValues: AdminAuditLogFilters = {
  action: "",
  entity_type: "",
  actor_user_id: "",
}

export default function AdminAuditLogsFilter({
  filters,
  onApply,
  onReset,
}: AdminAuditLogsFilterProps) {
  const { t } = useTranslation("adminAuditLogs")

  const filterFields: FilterField<AdminAuditLogFilters>[] = [
    {
      name: "action",
      label: t("filters.actionPlaceholder"),
      type: "text",
      placeholder: t("filters.actionPlaceholder"),
      icon: Search,
      minWidth: "180px",
    },
    {
      name: "entity_type",
      label: t("filters.entityPlaceholder"),
      type: "text",
      placeholder: t("filters.entityPlaceholder"),
      icon: Boxes,
      minWidth: "180px",
    },
    {
      name: "actor_user_id",
      label: t("filters.actorPlaceholder"),
      type: "text",
      placeholder: t("filters.actorPlaceholder"),
      icon: UserRound,
      minWidth: "160px",
    },
  ]

  return (
    <CustomFilter
      filters={filterFields}
      onApplyFilters={onApply}
      onResetFilters={onReset}
      defaultValues={defaultValues}
      initialFilters={filters}
      title={t("title")}
    />
  )
}
