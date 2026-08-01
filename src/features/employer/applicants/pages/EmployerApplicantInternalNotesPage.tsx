import { StickyNote } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import InternalNotes from "../components/InternalNotes"
import { useEmployerApplicantDetail } from "../hooks/useEmployerApplicantDetail"

export default function EmployerApplicantInternalNotesPage() {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { id } = useParams()
  const applicant = useEmployerApplicantDetail(id)
  const candidate = applicant.data?.candidate
  const candidateName =
    candidate?.full_name || candidate?.name || candidate?.email || t("unknownCandidate")

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("internalNotes.pageTitle")}
        description={candidateName}
        icon={StickyNote}
        showBackButton
        backButtonLabel={t("actions.backToApplicant")}
        onBackClick={() =>
          navigate(id ? ROUTES.employer.applicantDetails(id) : ROUTES.employer.applicants)
        }
      />
      {id && <InternalNotes applicationId={id} />}
    </div>
  )
}
