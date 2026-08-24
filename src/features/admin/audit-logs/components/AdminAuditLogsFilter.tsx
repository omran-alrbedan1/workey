import { Calendar, Hash, Search, Boxes, UserRound } from "lucide-react"
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
  entity_id: "",
  date_from: "",
  date_to: "",
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
      label: t("filters.entity"),
      type: "select",
      placeholder: t("filters.entityPlaceholder"),
      icon: Boxes,
      minWidth: "180px",
      options: [
        { label: t("entities.user"), value: "App\\Models\\User" },
        { label: t("entities.company"), value: "App\\Models\\Company" },
        { label: t("entities.job"), value: "App\\Models\\JobPosting" },
        { label: t("entities.application"), value: "App\\Models\\JobApplication" },
        { label: t("entities.interview"), value: "App\\Models\\Interview" },
        { label: t("entities.test"), value: "App\\Models\\Test" },
      ],
    },
    {
      name: "actor_user_id",
      label: t("filters.actorPlaceholder"),
      type: "text",
      placeholder: t("filters.actorPlaceholder"),
      icon: UserRound,
      minWidth: "160px",
    },
    {
      name: "entity_id",
      label: t("filters.entityId"),
      type: "text",
      placeholder: t("filters.entityId"),
      icon: Hash,
      minWidth: "130px",
    },
    {
      name: "date_from",
      label: t("filters.dateFrom"),
      type: "date",
      placeholder: t("filters.dateFrom"),
      icon: Calendar,
      minWidth: "150px",
    },
    {
      name: "date_to",
      label: t("filters.dateTo"),
      type: "date",
      placeholder: t("filters.dateTo"),
      icon: Calendar,
      minWidth: "150px",
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
