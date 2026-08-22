import { Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { StatusBadge } from "@/components/shared/badges"
import { keyOf } from "@/lib/keyValue"
import CompanyVisualHeader from "../components/CompanyVisualHeader"
import EmployerCompanyForm from "../components/EmployerCompanyForm"
import TeamManagementSection from "../components/TeamManagementSection"
import { useEmployerCompany } from "../hooks/useEmployerCompany"

export default function EmployerCompanyPage() {
  const { t } = useTranslation("employerCompany")
  const company = useEmployerCompany()

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

  const status = company.data
    ? keyOf(company.data.approval_status ?? company.data.status, "pending")
    : "pending"

  const handleLogoUpload = (file: File) => {
    company.updateLogoMutation.mutate(file)
  }

  const handleLogoRemove = () => {
    if (!company.data) return
    company.updateMutation.mutate({
      name: company.data.name,
      industry: company.data.industry,
      website: company.data.website,
      location: company.data.location,
      description: company.data.description,
      remove_logo: true,
    })
  }

  const handleCoverUpload = (file: File) => {
    company.updateCoverMutation.mutate(file)
  }

  const handleCoverRemove = () => {
    company.removeCoverMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={Building2}
        rightContent={company.data ? <StatusBadge status={status} variant="soft" /> : null}
      />
      {company.isPending || !company.data ? (
        <div className="h-96 animate-pulse rounded-lg bg-background-secondary" />
      ) : (
        <>
          <CompanyVisualHeader company={company.data} />
          <EmployerCompanyForm
            company={company.data}
            isPending={company.updateMutation.isPending}
            onSubmit={company.updateMutation.mutateAsync}
            onLogoUpload={handleLogoUpload}
            onLogoRemove={handleLogoRemove}
            onCoverUpload={handleCoverUpload}
            onCoverRemove={handleCoverRemove}
            isLogoUploading={company.updateLogoMutation.isPending}
            isCoverUploading={company.updateCoverMutation.isPending}
          />
          <TeamManagementSection />
        </>
      )}
    </div>
  )
}
