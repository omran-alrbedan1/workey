import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "@/config"
import { keyOf } from "@/lib/keyValue"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { useCreateEmployerInterview } from "@/features/employer/interviews/hooks/useCreateEmployerInterview"
import {
  useApplicationStatusMutation,
  useDownloadCv,
  useEmployerApplicantDetail,
  usePreviewCv,
} from "./useEmployerApplicantDetail"
import { useApplicationInterviews } from "./useApplicationInterviews"
import { useApplicationTests } from "./useApplicationTests"
import { candidateDisplayName } from "../utils/candidateDisplay"
import { canPreviewCv, getApplicationCvDocument, type ApplicationCvDocument } from "../utils/cv"
import type {
  ApplicationStatusKey,
  EmployerApplicantDetail,
  EmployerInterviewInput,
  EmployerTestAttempt,
} from "../types/employerApplicants.types"

export interface EmployerApplicantDetailsModel {
  id?: string
  application?: EmployerApplicantDetail
  candidateName: string
  isPending: boolean
  isError: boolean
  activeTab: string
  isCvBusy: boolean
  showScheduleDialog: boolean
  isStatusPending: boolean
  isCreateInterviewPending: boolean
  cvDocument: ApplicationCvDocument | null
  tests: ReturnType<typeof useApplicationTests>
  interviews: ReturnType<typeof useApplicationInterviews>
  setActiveTab: (tab: string) => void
  setShowScheduleDialog: (open: boolean) => void
  refetch: () => Promise<unknown>
  goBack: () => void
  handleStatusChange: (status: ApplicationStatusKey, note?: string) => void
  handleStatusDecision: (status: "accepted" | "rejected" | "on_hold", note: string) => Promise<void>
  handlePreviewCv: () => Promise<void>
  handleDownloadCv: () => Promise<void>
  handleScheduleInterview: (applicationId: string | number, input: EmployerInterviewInput) => Promise<void>
  openFirstTest: () => void
  openTest: (assignment: EmployerTestAttempt) => void
  showCandidateTab: () => void
}

export function useEmployerApplicantDetailsPage(unknownCandidateLabel: string): EmployerApplicantDetailsModel {
  const navigate = useNavigate()
  const { id } = useParams()
  const applicant = useEmployerApplicantDetail(id)
  const downloadCv = useDownloadCv()
  const previewCv = usePreviewCv()
  const statusMutation = useApplicationStatusMutation(id)
  const tests = useApplicationTests(applicant.data?.id)
  const interviews = useApplicationInterviews(applicant.data?.id)
  const createInterview = useCreateEmployerInterview()
  const [isCvBusy, setIsCvBusy] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("candidate")

  const application = applicant.data
  const candidateName = candidateDisplayName(application, unknownCandidateLabel)

  const goBack = () => {
    if (application?.job_posting?.id) {
      navigate(ROUTES.employer.jobApplicants(application.job_posting.id))
      return
    }
    navigate(ROUTES.employer.applicants)
  }

  const handleDownloadCv = async () => {
    if (!application || !getApplicationCvDocument(application)?.canDownload) {
      showErrorToast("CV download is not available for this application")
      return
    }

    setIsCvBusy(true)
    try {
      await downloadCv(application)
      showSuccessToast("CV downloaded")
    } catch {
      showErrorToast("Failed to download CV")
    } finally {
      setIsCvBusy(false)
    }
  }

  const handlePreviewCv = async () => {
    if (!application || !canPreviewCv(application)) {
      showErrorToast("CV preview is unavailable")
      return
    }

    setIsCvBusy(true)
    try {
      await previewCv(application)
    } catch {
      showErrorToast("CV preview is unavailable")
    } finally {
      setIsCvBusy(false)
    }
  }

  const handleStatusChange = (status: ApplicationStatusKey, note?: string) => {
    if (!id) return
    statusMutation.mutate({ status, note })
  }

  const handleStatusDecision = async (status: "accepted" | "rejected" | "on_hold", note: string) => {
    await statusMutation.mutateAsync({ status, note })
  }

  const handleScheduleInterview = async (applicationId: string | number, input: EmployerInterviewInput) => {
    await createInterview.mutateAsync({ applicationId, input })
    await Promise.all([interviews.refetch(), applicant.refetch()])
    setShowScheduleDialog(false)
  }

  const openFirstTest = () => {
    const firstTest = tests.data?.items[0]
    if (application && firstTest) {
      navigate(ROUTES.employer.applicantTestDetails(application.id, firstTest.id))
    }
  }

  const openTest = (assignment: EmployerTestAttempt) => {
    if (application) {
      navigate(ROUTES.employer.applicantTestDetails(application.id, assignment.id))
    }
  }

  return {
    id,
    application,
    candidateName,
    isPending: applicant.isPending,
    isError: applicant.isError,
    activeTab,
    isCvBusy,
    showScheduleDialog,
    isStatusPending: statusMutation.isPending,
    isCreateInterviewPending: createInterview.isPending,
    cvDocument: application ? getApplicationCvDocument(application) : null,
    tests,
    interviews,
    setActiveTab,
    setShowScheduleDialog,
    refetch: applicant.refetch,
    goBack,
    handleStatusChange,
    handleStatusDecision,
    handlePreviewCv,
    handleDownloadCv,
    handleScheduleInterview,
    openFirstTest,
    openTest,
    showCandidateTab: () => setActiveTab("candidate"),
  }
}

