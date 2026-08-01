import { Building2, Search, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CustomFilter, type FilterField } from "@/components/shared/custom/CustomFilter"
import type { Option } from "@/types/customFormField.types"
import {
  ADMIN_COMPANY_FILTER_DEFAULTS,
  type AdminCompanyFilterForm,
} from "../types/adminCompanies.types"

interface AdminCompaniesFilterProps {
  onApplyFilters: (values: AdminCompanyFilterForm) => void
  onResetFilters: () => void
  isLoading: boolean
  initialFilters: Partial<AdminCompanyFilterForm>
  industries: Option[]
}

export default function AdminCompaniesFilter({
  onApplyFilters,
  onResetFilters,
  isLoading,
  initialFilters,
  industries,
}: AdminCompaniesFilterProps) {
  const { t } = useTranslation("adminCompanies")
  const fields: FilterField<AdminCompanyFilterForm>[] = [
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
        { value: "pending", label: t("common:pending") },
        { value: "approved", label: t("common:approved") },
        { value: "rejected", label: t("common:rejected") },
        { value: "suspended", label: t("filters.suspended") },
      ],
    },
    {
      name: "industry",
      label: t("filters.industryLabel"),
      type: "select",
      icon: Building2,
      emptyValue: "all",
      options: [{ value: "all", label: t("filters.allIndustries") }, ...industries],
    },
  ]

  return (
    <CustomFilter<AdminCompanyFilterForm>
      title={t("filters.title")}
      filters={fields}
      defaultValues={ADMIN_COMPANY_FILTER_DEFAULTS}
      initialFilters={initialFilters}
      onApplyFilters={onApplyFilters}
      onResetFilters={onResetFilters}
      isLoading={isLoading}
    />
  )
}
