import { useCandidateInfoTab } from "../../hooks/useCandidateInfoTab"
import type { ApplicationStatusKey, EmployerApplicantDetail } from "../../types/employerApplicants.types"
import CandidateInfoTabView from "./candidate-info/CandidateInfoTabView"

interface CandidateInfoTabProps {
  application: EmployerApplicantDetail
  candidateName: string
  onStatusChange: (status: ApplicationStatusKey) => void
  isStatusPending: boolean
}

export default function CandidateInfoTab({
  application,
  candidateName,
  onStatusChange,
  isStatusPending,
}: CandidateInfoTabProps) {
  return (
    <CandidateInfoTabView
      model={useCandidateInfoTab(application, candidateName)}
      onStatusChange={onStatusChange}
      isStatusPending={isStatusPending}
    />
  )
}
