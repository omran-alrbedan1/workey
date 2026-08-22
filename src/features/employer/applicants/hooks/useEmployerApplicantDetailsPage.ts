import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "@/config"
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
  error?: unknown
  activeTab: string
  isCvBusy: boolean
  showScheduleDialog: boolean
  pendingStatusTarget: ApplicationStatusKey | null
  isStatusPending: boolean
  isCreateInterviewPending: boolean
  cvDocument: ApplicationCvDocument | null
  informationRequestDialogOpen: boolean
  tests: ReturnType<typeof useApplicationTests>
  interviews: ReturnType<typeof useApplicationInterviews>
  setActiveTab: (tab: string) => void
  setShowScheduleDialog: (open: boolean) => void
  openStatusDialog: (target: ApplicationStatusKey) => void
  closeStatusDialog: () => void
  confirmStatusChange: (note?: string) => void
  setInformationRequestDialogOpen: (open: boolean) => void
  handleRequestInformation: () => void
  refetch: () => Promise<unknown>
  goBack: () => void
  handlePreviewCv: () => Promise<void>
  handleDownloadCv: () => Promise<void>
  handleScheduleInterview: (
    applicationId: string | number,
    input: EmployerInterviewInput,
  ) => Promise<void>
  goToTests: () => void
  openFirstTest: () => void
  openTest: (assignment: EmployerTestAttempt) => void
}

export function useEmployerApplicantDetailsPage(
  unknownCandidateLabel: string,
): EmployerApplicantDetailsModel {
  const navigate = useNavigate()
  const location = useLocation()
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
  const [pendingStatusTarget, setPendingStatusTarget] = useState<ApplicationStatusKey | null>(null)
  const [informationRequestDialogOpen, setInformationRequestDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const state = location.state as { openInformationRequest?: boolean } | null
    if (!state?.openInformationRequest) return

    setActiveTab("informationRequests")
    setInformationRequestDialogOpen(true)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

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

  const openStatusDialog = (target: ApplicationStatusKey) => setPendingStatusTarget(target)

  const closeStatusDialog = () => setPendingStatusTarget(null)

  const confirmStatusChange = (note?: string) => {
    if (!id || !pendingStatusTarget) return
    statusMutation.mutate(
      { status: pendingStatusTarget, note },
      { onSettled: () => setPendingStatusTarget(null) },
    )
  }

  const handleRequestInformation = () => {
    setActiveTab("informationRequests")
    setInformationRequestDialogOpen(true)
  }

  const handleScheduleInterview = async (
    applicationId: string | number,
    input: EmployerInterviewInput,
  ) => {
    await createInterview.mutateAsync({ applicationId, input })
    await Promise.all([interviews.refetch(), applicant.refetch()])
    setShowScheduleDialog(false)
  }

  const goToTests = () => navigate(ROUTES.employer.tests)

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
    error: applicant.error,
    activeTab,
    isCvBusy,
    showScheduleDialog,
    pendingStatusTarget,
    isStatusPending: statusMutation.isPending,
    isCreateInterviewPending: createInterview.isPending,
    cvDocument: application ? getApplicationCvDocument(application) : null,
    informationRequestDialogOpen,
    tests,
    interviews,
    setActiveTab,
    setShowScheduleDialog,
    openStatusDialog,
    closeStatusDialog,
    confirmStatusChange,
    setInformationRequestDialogOpen,
    handleRequestInformation,
    refetch: applicant.refetch,
    goBack,
    handlePreviewCv,
    handleDownloadCv,
    handleScheduleInterview,
    goToTests,
    openFirstTest,
    openTest,
  }
}
