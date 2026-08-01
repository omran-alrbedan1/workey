import type { FilterConfig } from "@/hooks/useFilter"
import type { AdminCompanyRecord } from "../types/adminCompanies.types"

export const adminCompanyFilterConfig: FilterConfig<AdminCompanyRecord>[] = [
  {
    key: "search",
    label: "Search",
    type: "search",
    getValue: (company) => [
      company.name,
      company.industry ?? "",
      company.location ?? "",
      company.employer?.name ?? "",
      company.employer?.email ?? "",
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    getValue: (company) => (company.approval_status ?? company.status ?? "pending").toLowerCase(),
  },
  {
    key: "industry",
    label: "Industry",
    type: "select",
    getValue: (company) => company.industry ?? "",
  },
]
