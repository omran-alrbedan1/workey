import { Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { StatusBadge } from "@/components/shared/badges"
import EmployerCompanyForm from "../components/EmployerCompanyForm"
import { useEmployerCompany } from "../hooks/useEmployerCompany"

export default function EmployerCompanyPage() {
  const { t } = useTranslation("employerCompany")
  const company = useEmployerCompany()

  const getStatusKey = (v: unknown): string => {
    if (!v) return ""
    if (typeof v === "string") return v
    if (typeof v === "object") return (v as { key?: string }).key ?? ""
    return ""
  }

  if (company.isError) {
    return (
      <ErrorState
        variant="network"
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void company.refetch()}
      />
    )
  }

  const statusKey = company.data
    ? getStatusKey(company.data.approval_status ?? company.data.status ?? "pending") || "pending"
    : "pending"

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={Building2}
        rightContent={
          company.data ? (
            <StatusBadge status={statusKey} variant="soft" />
          ) : null
        }
      />
      {company.isPending || !company.data ? (
        <div className="h-96 animate-pulse rounded-lg bg-background-secondary" />
      ) : (
        <EmployerCompanyForm
          company={company.data}
          isPending={company.updateMutation.isPending}
          onSubmit={company.updateMutation.mutateAsync}
        />
      )}
    </div>
  )
}
