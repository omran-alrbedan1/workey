import { ArrowDownUp, BriefcaseBusiness, CheckCircle2, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CustomFilter, type FilterField } from "@/components/shared/custom/CustomFilter"
import {
  ADMIN_JOB_FILTER_DEFAULTS,
  type AdminJobFilterForm,
} from "../types/adminJobs.types"

interface AdminJobsFilterProps {
  onApplyFilters: (values: AdminJobFilterForm) => void
  onResetFilters: () => void
  isLoading: boolean
  initialFilters: Partial<AdminJobFilterForm>
}

export default function AdminJobsFilter({
  onApplyFilters,
  onResetFilters,
  isLoading,
  initialFilters,
}: AdminJobsFilterProps) {
  const { t } = useTranslation("adminJobs")
  const fields: FilterField<AdminJobFilterForm>[] = [
    {
      name: "work_mode",
      label: t("filters.workMode"),
      type: "select",
      icon: MapPin,
      emptyValue: "all",
      options: [
        { value: "all", label: t("filters.allWorkModes") },
        { value: "remote", label: t("workModes.remote") },
        { value: "on_site", label: t("workModes.on_site") },
        { value: "hybrid", label: t("workModes.hybrid") },
      ],
    },
    {
      name: "employment_type",
      label: t("filters.employmentType"),
      type: "select",
      icon: BriefcaseBusiness,
      emptyValue: "all",
      options: [
        { value: "all", label: t("filters.allEmploymentTypes") },
        { value: "full_time", label: t("employmentTypes.full_time") },
        { value: "part_time", label: t("employmentTypes.part_time") },
        { value: "contract", label: t("employmentTypes.contract") },
        { value: "freelance", label: t("employmentTypes.freelance") },
      ],
    },
    {
      name: "accepting_applications",
      label: t("filters.acceptingApplications"),
      type: "select",
      icon: CheckCircle2,
      emptyValue: "all",
      options: [
        { value: "all", label: t("filters.allApplicationStates") },
        { value: "true", label: t("filters.accepting") },
        { value: "false", label: t("filters.notAccepting") },
      ],
    },
    {
      name: "sort_by",
      label: t("filters.sortBy"),
      type: "select",
      icon: ArrowDownUp,
      emptyValue: "created_at",
      options: [
        { value: "created_at", label: t("sort.createdAt") },
        { value: "published_at", label: t("sort.publishedAt") },
        { value: "application_deadline", label: t("sort.applicationDeadline") },
        { value: "title", label: t("sort.title") },
      ],
    },
    {
      name: "sort_direction",
      label: t("filters.sortDirection"),
      type: "select",
      icon: ArrowDownUp,
      emptyValue: "desc",
      options: [
        { value: "desc", label: t("sort.desc") },
        { value: "asc", label: t("sort.asc") },
      ],
    },
  ]

  return (
    <CustomFilter<AdminJobFilterForm>
      title={t("filters.title")}
      filters={fields}
      defaultValues={ADMIN_JOB_FILTER_DEFAULTS}
      initialFilters={initialFilters}
      onApplyFilters={onApplyFilters}
      onResetFilters={onResetFilters}
      isLoading={isLoading}
    />
  )
}
