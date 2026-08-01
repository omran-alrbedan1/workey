import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import EmployerJobForm from "../components/EmployerJobForm"
import { useCreateEmployerJob } from "../hooks/useCreateEmployerJob"

export default function EmployerCreateJobPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const createJob = useCreateEmployerJob()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
        icon={Plus}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.jobs)}
      />
      <EmployerJobForm isPending={createJob.isPending} onSubmit={createJob.mutateAsync} />
    </div>
  )
}
