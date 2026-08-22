import {
  ClipboardCheck,
  FileQuestion,
  History,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Target,
  UserRound,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScreeningAnswersTab from "../tabs/ScreeningAnswersTab"
import TestsTab from "../tabs/TestsTab"
import InterviewsTab from "../tabs/InterviewsTab"
import InformationRequests from "../InformationRequests"
import InternalNotes from "../InternalNotes"
import ApplicationStatusHistory from "../ApplicationStatusHistory"
import ApplicationStatusChangeDialog from "../ApplicationStatusChangeDialog"
import CandidateProfileSection from "./CandidateProfileSection"
import MatchingScoreSection from "./MatchingScoreSection"
import OverviewSection from "./OverviewSection"
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
        icon={UserRound}
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

          <ApplicationStatusChangeDialog
            open={model.pendingStatusTarget !== null}
            onOpenChange={(open) => {
              if (!open) model.closeStatusDialog()
            }}
            currentStatus={model.application.status ?? null}
            targetStatus={model.pendingStatusTarget}
            onConfirm={model.confirmStatusChange}
            isSubmitting={model.isStatusPending}
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

  return (
    <TabsList className="w-full justify-start overflow-x-auto pb-2">
      <TabsTrigger value="overview" className="gap-2 whitespace-nowrap">
        <LayoutDashboard className="h-4 w-4" />
        {t("tabs.overview")}
      </TabsTrigger>
      <TabsTrigger value="profile" className="gap-2 whitespace-nowrap">
        <UserRound className="h-4 w-4" />
        {t("tabs.profile")}
      </TabsTrigger>
      <TabsTrigger value="screening" className="gap-2 whitespace-nowrap">
        <ClipboardCheck className="h-4 w-4" />
        {t("tabs.screening")}
      </TabsTrigger>
      <TabsTrigger value="matching" className="gap-2 whitespace-nowrap">
        <Target className="h-4 w-4" />
        {t("tabs.matching")}
      </TabsTrigger>
      <TabsTrigger value="tests" className="gap-2 whitespace-nowrap">
        <ListChecks className="h-4 w-4" />
        {t("tabs.tests")}
      </TabsTrigger>
      <TabsTrigger value="interviews" className="gap-2 whitespace-nowrap">
        <Video className="h-4 w-4" />
        {t("tabs.interviews")}
      </TabsTrigger>
      <TabsTrigger value="informationRequests" className="gap-2 whitespace-nowrap">
        <FileQuestion className="h-4 w-4" />
        {t("tabs.informationRequests")}
      </TabsTrigger>
      <TabsTrigger value="internalNotes" className="gap-2 whitespace-nowrap">
        <MessageSquare className="h-4 w-4" />
        {t("tabs.internalNotes")}
      </TabsTrigger>
      <TabsTrigger value="statusHistory" className="gap-2 whitespace-nowrap">
        <History className="h-4 w-4" />
        {t("tabs.statusHistory")}
      </TabsTrigger>
    </TabsList>
  )
}

function ApplicantDetailsTabContent({ model }: { model: EmployerApplicantDetailsModel }) {
  const application = model.application

  if (!application) return null

  return (
    <>
      <TabsContent value="overview">
        <OverviewSection
          application={application}
          candidateName={model.candidateName}
          isStatusPending={model.isStatusPending}
          onOpenStatusDialog={model.openStatusDialog}
          onAssignTest={model.goToTests}
          onScheduleInterview={() => model.setShowScheduleDialog(true)}
          onRequestInformation={model.handleRequestInformation}
        />
      </TabsContent>

      <TabsContent value="profile">
        <CandidateProfileSection
          application={application}
          cvDocument={model.cvDocument}
          isCvBusy={model.isCvBusy}
          onPreviewCv={() => void model.handlePreviewCv()}
          onDownloadCv={() => void model.handleDownloadCv()}
        />
      </TabsContent>

      <TabsContent value="screening">
        <ScreeningAnswersTab answers={application.screening_answers ?? []} />
      </TabsContent>

      <TabsContent value="matching">
        <MatchingScoreSection application={application} />
      </TabsContent>

      <TabsContent value="tests">
        <TestsTab tests={model.tests} onViewAll={model.openFirstTest} onOpenTest={model.openTest} />
      </TabsContent>

      <TabsContent value="interviews">
        <InterviewsTab
          interviews={model.interviews}
          onSchedule={() => model.setShowScheduleDialog(true)}
        />
      </TabsContent>

      <TabsContent value="informationRequests">
        {model.id && (
          <InformationRequests
            applicationId={model.id}
            createOpen={model.informationRequestDialogOpen}
            onCreateOpenChange={model.setInformationRequestDialogOpen}
          />
        )}
      </TabsContent>

      <TabsContent value="internalNotes">
        {model.id && <InternalNotes applicationId={model.id} />}
      </TabsContent>

      <TabsContent value="statusHistory">
        <section className="rounded-xl border border-border bg-background-card p-5 shadow-card">
          <ApplicationStatusHistory history={application.status_history ?? []} />
        </section>
      </TabsContent>
    </>
  )
}
