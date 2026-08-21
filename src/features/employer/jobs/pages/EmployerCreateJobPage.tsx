import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import EmployerCreateJobWizard from "../components/EmployerCreateJobWizard"

export default function EmployerCreateJobPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()

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
      <EmployerCreateJobWizard />
    </div>
  )
}
