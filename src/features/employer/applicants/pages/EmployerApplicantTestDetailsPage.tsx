import ApplicantTestDetailsView from "../components/test-details/ApplicantTestDetailsView"
import { useApplicantTestDetailsPage } from "../hooks/useApplicantTestDetailsPage"

export default function EmployerApplicantTestDetailsPage() {
  return <ApplicantTestDetailsView model={useApplicantTestDetailsPage()} />
}
