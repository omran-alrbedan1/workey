import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ErrorState from "@/components/shared/states/ErrorState"
import { publicCompanyService } from "../services/publicCompany.service"
import PublicCompanyDetails from "../components/PublicCompanyDetails"
import PublicCompanyJobs from "../components/PublicCompanyJobs"
import { useQuery } from "@tanstack/react-query"

export default function PublicCompanyPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation("publicCompany")

  const { data: company, isLoading: companyLoading, isError: companyError } = useQuery({
    queryKey: ["public-company", slug],
    queryFn: () => publicCompanyService.getCompanyBySlug(slug!),
    enabled: !!slug,
  })

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["public-company-jobs", slug],
    queryFn: () => publicCompanyService.getCompanyJobs(slug!),
    enabled: !!slug,
  })

  if (companyLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <PublicCompanyDetails
          company={{
            id: "",
            name: "",
            slug: "",
          }}
          isLoading
        />
      </div>
    )
  }

  if (companyError || !company) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <ErrorState
          variant="network"
          title={t("errorTitle")}
          description={t("errorDescription")}
          className="min-h-[60vh]"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <PublicCompanyDetails company={company} />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">{t("openPositions")}</h2>
          <PublicCompanyJobs jobs={jobsData?.data ?? []} isLoading={jobsLoading} />
        </div>
      </div>
    </div>
  )
}
