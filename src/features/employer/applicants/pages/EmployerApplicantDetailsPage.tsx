import { useTranslation } from "react-i18next"
import EmployerApplicantDetailsView from "../components/details/EmployerApplicantDetailsView"
import { useEmployerApplicantDetailsPage } from "../hooks/useEmployerApplicantDetailsPage"

export default function EmployerApplicantDetailsPage() {
  const { t } = useTranslation("employerApplicants")

  return (
    <EmployerApplicantDetailsView
      model={useEmployerApplicantDetailsPage(t("unknownCandidate"))}
    />
  )
}
