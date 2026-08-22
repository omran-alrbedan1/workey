import { Calendar, Building2, BriefcaseBusiness, Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CustomFilter, type FilterField } from "@/components/shared/custom/CustomFilter"
import type { AdminReportFilters } from "../types/adminReports.types"

interface AdminReportsFilterProps {
  filters: AdminReportFilters
  onApply: (filters: AdminReportFilters) => void
  onReset: () => void
}

const defaultValues: AdminReportFilters = {
  date_from: "",
  date_to: "",
  company_id: "",
  job_id: "",
  status: "",
}

export default function AdminReportsFilter({ filters, onApply, onReset }: AdminReportsFilterProps) {
  const { t } = useTranslation("adminReports")

  const filterFields: FilterField<AdminReportFilters>[] = [
    {
      name: "date_from",
      label: t("filters.dateFrom"),
      type: "date",
      placeholder: t("filters.dateFrom"),
      icon: Calendar,
      minWidth: "160px",
    },
    {
      name: "date_to",
      label: t("filters.dateTo"),
      type: "date",
      placeholder: t("filters.dateTo"),
      icon: Calendar,
      minWidth: "160px",
    },
    {
      name: "company_id",
      label: t("filters.company"),
      type: "text",
      placeholder: t("filters.company"),
      icon: Building2,
      minWidth: "160px",
    },
    {
      name: "job_id",
      label: t("filters.job"),
      type: "text",
      placeholder: t("filters.job"),
      icon: BriefcaseBusiness,
      minWidth: "140px",
    },
    {
      name: "status",
      label: t("filters.status"),
      type: "text",
      placeholder: t("filters.status"),
      icon: Globe,
      minWidth: "140px",
    },
  ]

  return (
    <CustomFilter
      filters={filterFields}
      onApplyFilters={onApply}
      onResetFilters={onReset}
      defaultValues={defaultValues}
      initialFilters={filters}
      title={t("filters.title")}
    />
  )
}
