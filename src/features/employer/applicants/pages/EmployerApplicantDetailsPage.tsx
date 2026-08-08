import {
  User,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import {
  useApplicationStatusMutation,
  useDownloadCv,
  useEmployerApplicantDetail,
  usePreviewCv,
} from "../hooks/useEmployerApplicantDetail"
import { useApplicationTests } from "../hooks/useApplicationTests"
import { useApplicationInterviews } from "../hooks/useApplicationInterviews"
import { useCreateEmployerInterview } from "@/features/employer/interviews/hooks/useCreateEmployerInterview"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import InternalNotes from "../components/InternalNotes"
import InformationRequests from "../components/InformationRequests"
import ApplicationTestsDialog from "../components/ApplicationTestsDialog"
import ScheduleInterviewDialog from "../components/ScheduleInterviewDialog"
import CandidateInfoTab from "../components/tabs/CandidateInfoTab"
import ScreeningAnswersTab from "../components/tabs/ScreeningAnswersTab"
import CoverLetterTab from "../components/tabs/CoverLetterTab"
import TestsTab from "../components/tabs/TestsTab"
import InterviewsTab from "../components/tabs/InterviewsTab"
import FinalReviewPanel from "../components/FinalReviewPanel"
import { keyOf } from "@/lib/keyValue"
import type { ApplicationStatusKey, EmployerApplicantDetail, EmployerInterviewInput } from "../types/employerApplicants.types"

function getCandidateName(application: EmployerApplicantDetail | undefined, fallback: string) {
  const identity = application?.submitted_snapshot?.profile?.identity
  return application?.candidate_summary?.name || identity?.full_name || identity?.email || application?.candidate_summary?.email || fallback
}

function shouldShowFinalReview(application: EmployerApplicantDetail) {
  const status = keyOf(application.status)
  const transitions = application.allowed_status_transitions?.map((item) => item.key) ?? []
  return (
    ["final_review", "accepted", "rejected", "on_hold"].includes(status) ||
    transitions.some((transition) => ["accepted", "rejected", "on_hold", "need_more_information"].includes(transition))
  )
}

export default function EmployerApplicantDetailsPage() {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: application, isPending, isError, refetch } = useEmployerApplicantDetail(id)
  const downloadCv = useDownloadCv()
  const previewCv = usePreviewCv()
  const statusMutation = useApplicationStatusMutation(id)
  const tests = useApplicationTests(application?.id)
  const interviews = useApplicationInterviews(application?.id)
  const createInterview = useCreateEmployerInterview()

  const [isCvBusy, setIsCvBusy] = useState(false)
  const [showTestsDialog, setShowTestsDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("candidate")

  const handleDownloadCv = async () => {
    if (!id) return
    setIsCvBusy(true)
    try {
      await downloadCv(id)
      showSuccessToast("CV downloaded")
    } catch {
      showErrorToast("Failed to download CV")
    } finally {
      setIsCvBusy(false)
    }
  }

  const handlePreviewCv = async () => {
    if (!id) return
    setIsCvBusy(true)
    try {
      await previewCv(id)
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
    await interviews.refetch()
    setShowScheduleDialog(false)
  }

  if (isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void refetch()}
      />
    )
  }

  const candidateName = getCandidateName(application, t("unknownCandidate"))

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("detailTitle")}
        description={candidateName}
        icon={User}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => {
          if (application?.job_posting?.id) {
            navigate(ROUTES.employer.jobApplicants(application.job_posting.id))
          } else {
            navigate(ROUTES.employer.applicants)
          }
        }}
      />

      {isPending ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : application ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="candidate">{t("tabs.candidate")}</TabsTrigger>
              {application.screening_answers && application.screening_answers.length > 0 && (
                <TabsTrigger value="screening">{t("tabs.screening")}</TabsTrigger>
              )}
              {application.cover_letter && (
                <TabsTrigger value="coverLetter">{t("tabs.coverLetter")}</TabsTrigger>
              )}
              <TabsTrigger value="tests">{t("tabs.tests")}</TabsTrigger>
              <TabsTrigger value="interviews">{t("tabs.interviews")}</TabsTrigger>
              {shouldShowFinalReview(application) && (
                <TabsTrigger value="finalReview">{t("tabs.finalReview")}</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="candidate">
              <CandidateInfoTab
                application={application}
                candidateName={candidateName}
                onDownloadCv={handleDownloadCv}
                isDownloading={isCvBusy}
                onNavigateToInternalNotes={() => id && navigate(ROUTES.employer.applicantInternalNotes(id))}
                onNavigateToInformationRequests={() => id && navigate(ROUTES.employer.applicantInformationRequests(id))}
                onStatusChange={handleStatusChange}
                isStatusPending={statusMutation.isPending}
              />
            </TabsContent>

            {application.screening_answers && application.screening_answers.length > 0 && (
              <TabsContent value="screening">
                <ScreeningAnswersTab answers={application.screening_answers} />
              </TabsContent>
            )}

            {application.cover_letter && (
              <TabsContent value="coverLetter">
                <CoverLetterTab coverLetter={application.cover_letter} />
              </TabsContent>
            )}

            <TabsContent value="tests">
              <TestsTab tests={tests} onViewAll={() => setShowTestsDialog(true)} />
            </TabsContent>

            <TabsContent value="interviews">
              <InterviewsTab interviews={interviews} onSchedule={() => setShowScheduleDialog(true)} />
            </TabsContent>

            {shouldShowFinalReview(application) && (
              <TabsContent value="finalReview">
                <FinalReviewPanel
                  application={application}
                  tests={tests}
                  interviews={interviews}
                  isDecisionPending={statusMutation.isPending}
                  isCvBusy={isCvBusy}
                  onPreviewCv={handlePreviewCv}
                  onDownloadCv={handleDownloadCv}
                  onDecision={handleStatusDecision}
                  onRequestInformation={() => id && navigate(ROUTES.employer.applicantInformationRequests(id))}
                />
              </TabsContent>
            )}
          </Tabs>

          {/* Internal Notes */}
          <InternalNotes applicationId={id!} />

          {/* Information Requests */}
          <InformationRequests applicationId={id!} />

          {/* Tests Dialog */}
          <ApplicationTestsDialog
            application={application || null}
            open={showTestsDialog}
            onOpenChange={setShowTestsDialog}
            onNextStep={(_applicationId, status) => statusMutation.mutateAsync({ status })}
          />

          {/* Schedule Interview Dialog */}
          <ScheduleInterviewDialog
            application={application || null}
            open={showScheduleDialog}
            isPending={createInterview.isPending}
            onOpenChange={setShowScheduleDialog}
            onSubmit={handleScheduleInterview}
          />
        </>
      ) : null}
    </div>
  )
}
