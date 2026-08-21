import {
  ClipboardCheck,
  FileText,
  ListChecks,
  MailQuestion,
  MessageCircle,
  User,
  FileText as FileTextIcon,
  MessageSquare,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CandidateInfoTab from "../tabs/CandidateInfoTab"
import CoverLetterTab from "../tabs/CoverLetterTab"
import InterviewsTab from "../tabs/InterviewsTab"
import ScreeningAnswersTab from "../tabs/ScreeningAnswersTab"
import TestsTab from "../tabs/TestsTab"
import InformationRequests from "../InformationRequests"
import InternalNotes from "../InternalNotes"
import CvSummaryPanel from "../CvSummaryPanel"
import ScheduleInterviewDialog from "../ScheduleInterviewDialog"
import type { EmployerApplicantDetailsModel } from "../../hooks/useEmployerApplicantDetailsPage"

interface EmployerApplicantDetailsViewProps {
  model: EmployerApplicantDetailsModel
}

export default function EmployerApplicantDetailsView({ model }: EmployerApplicantDetailsViewProps) {
  const { t } = useTranslation("employerApplicants")

  if (model.isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void model.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("detailTitle")}
        description={model.candidateName}
        icon={User}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={model.goBack}
      />

      {model.isPending ? (
        <ApplicantDetailsSkeleton />
      ) : model.application ? (
        <>
          <Tabs value={model.activeTab} onValueChange={model.setActiveTab} className="space-y-6">
            <ApplicantDetailsTabs model={model} />
            <ApplicantDetailsTabContent model={model} />
          </Tabs>

          <ScheduleInterviewDialog
            application={model.application}
            open={model.showScheduleDialog}
            isPending={model.isCreateInterviewPending}
            onOpenChange={model.setShowScheduleDialog}
            onSubmit={model.handleScheduleInterview}
          />
        </>
      ) : null}
    </div>
  )
}

function ApplicantDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

function ApplicantDetailsTabs({ model }: { model: EmployerApplicantDetailsModel }) {
  const { t } = useTranslation("employerApplicants")
  const application = model.application

  if (!application) return null

  return (
    <TabsList className="w-full justify-start overflow-x-auto pb-2">
      <TabsTrigger value="candidate" className="gap-2 whitespace-nowrap">
        <User className="h-4 w-4" />
        {t("tabs.candidate")}
      </TabsTrigger>
      {application.screening_answers && application.screening_answers.length > 0 && (
        <TabsTrigger value="screening" className="gap-2 whitespace-nowrap">
          <ClipboardCheck className="h-4 w-4" />
          {t("tabs.screening")}
        </TabsTrigger>
      )}
      {application.cover_letter && (
        <TabsTrigger value="coverLetter" className="gap-2 whitespace-nowrap">
          <FileText className="h-4 w-4" />
          {t("tabs.coverLetter")}
        </TabsTrigger>
      )}
      <TabsTrigger value="tests" className="gap-2 whitespace-nowrap">
        <ListChecks className="h-4 w-4" />
        {t("tabs.tests")}
      </TabsTrigger>
      <TabsTrigger value="interviews" className="gap-2 whitespace-nowrap">
        <MessageCircle className="h-4 w-4" />
        {t("tabs.interviews")}
      </TabsTrigger>
      <TabsTrigger value="internalNotes" className="gap-2 whitespace-nowrap">
        <MessageSquare className="h-4 w-4" />
        {t("tabs.internalNotes")}
      </TabsTrigger>
      <TabsTrigger value="informationRequests" className="gap-2 whitespace-nowrap">
        <FileTextIcon className="h-4 w-4" />
        {t("tabs.informationRequests")}
      </TabsTrigger>
    </TabsList>
  )
}

function ApplicantDetailsTabContent({ model }: { model: EmployerApplicantDetailsModel }) {
  const application = model.application

  if (!application) return null

  return (
    <>
      <TabsContent value="candidate">
        <div className="space-y-6">
          <CandidateInfoTab
            application={application}
            candidateName={model.candidateName}
            cvDocument={model.cvDocument}
            isCvBusy={model.isCvBusy}
            onStatusChange={model.handleStatusChange}
            onPreviewCv={() => void model.handlePreviewCv()}
            onDownloadCv={() => void model.handleDownloadCv()}
            isStatusPending={model.isStatusPending}
          />
          {model.id && <CvSummaryPanel applicationId={model.id} />}
        </div>
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
        <TestsTab tests={model.tests} onViewAll={model.openFirstTest} onOpenTest={model.openTest} />
      </TabsContent>

      <TabsContent value="interviews">
        <InterviewsTab interviews={model.interviews} onSchedule={() => model.setShowScheduleDialog(true)} />
      </TabsContent>

      <TabsContent value="internalNotes">
        {model.id && <InternalNotes applicationId={model.id} />}
      </TabsContent>

      <TabsContent value="informationRequests">
        {model.id && <InformationRequests applicationId={model.id} />}
      </TabsContent>
   
    </>
  )
}
