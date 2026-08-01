import { BrainCircuit } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import EmployerJobRankedCandidates from "../components/EmployerJobRankedCandidates"
import { useRankedCandidates } from "../hooks/useRankedCandidates"

export default function EmployerJobRankedCandidatesPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const rankedCandidates = useRankedCandidates(id)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("rankedCandidates.pageTitle")}
        description={t("rankedCandidates.pageDescription")}
        icon={BrainCircuit}
        showBackButton
        backButtonLabel={t("actions.backToJob")}
        onBackClick={() => navigate(id ? ROUTES.employer.jobDetails(id) : ROUTES.employer.jobs)}
      />
      <EmployerJobRankedCandidates
        candidates={rankedCandidates.data?.items ?? []}
        isLoading={rankedCandidates.isPending}
        isError={rankedCandidates.isError}
        onRetry={() => void rankedCandidates.refetch()}
      />
    </div>
  )
}
