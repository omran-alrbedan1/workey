import { CalendarClock, CheckCircle2, History, ListChecks, Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TestAssignmentDeadlinePanel from "../TestAssignmentDeadlinePanel"
import TestAssignmentRetakePanel from "../TestAssignmentRetakePanel"
import type { ApplicantTestDetailsModel } from "../../hooks/useApplicantTestDetailsPage"
import { assignmentDeadline } from "./testDetails.helpers"
import ApplicantTestGradingTab from "./ApplicantTestGradingTab"
import ApplicantTestNextStepTab from "./ApplicantTestNextStepTab"
import ApplicantTestOverviewTab from "./ApplicantTestOverviewTab"

interface ApplicantTestDetailsViewProps {
  model: ApplicantTestDetailsModel
}

export default function ApplicantTestDetailsView({ model }: ApplicantTestDetailsViewProps) {
  const { t } = useTranslation("employerApplicants")

  if (model.state === "error") {
    return (
      <ErrorState
        title={t("tests.loadError")}
        description={t("errors.description")}
        retry={() => void model.refetchTests()}
      />
    )
  }

  if (model.state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("tests.untitled")}
          description={t("detailDescription")}
          icon={ListChecks}
          showBackButton
          backButtonLabel={t("actions.backToApplicant")}
          onBackClick={model.goBack}
        />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    )
  }

  if (model.state === "not-found" || !model.assignment) {
    return (
      <ErrorState title={t("tests.untitled")} description={t("tests.empty")} retry={model.goBack} />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={model.assignment.test?.title || t("tests.untitled")}
        description={model.assignment.test?.description || t("detailDescription")}
        icon={ListChecks}
        showBackButton
        backButtonLabel={t("actions.backToApplicant")}
        onBackClick={model.goBack}
      />

      <Tabs value={model.activeTab} onValueChange={model.setActiveTab} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview" className="gap-2">
            <ListChecks className="h-4 w-4" />
            {t("detailTitle")}
          </TabsTrigger>
          <TabsTrigger value="grading" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t("tests.gradingTitle")}
          </TabsTrigger>
          <TabsTrigger value="deadline" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            {t("tests.deadlineTitle")}
          </TabsTrigger>
          <TabsTrigger value="retakes" className="gap-2">
            <History className="h-4 w-4" />
            {t("tests.retakeTitle")}
          </TabsTrigger>
          <TabsTrigger value="nextStep" className="gap-2">
            <Send className="h-4 w-4" />
            {t("tests.nextStep")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ApplicantTestOverviewTab
            assignment={model.assignment}
            score={model.score}
            maxScore={model.maxScore}
          />
        </TabsContent>

        <TabsContent value="grading">
          <ApplicantTestGradingTab
            activeAttemptId={model.activeAttemptId}
            answers={model.answers}
            drafts={model.drafts}
            loadingDetails={model.loadingDetails}
            submitted={model.submitted}
            downloadingQuestionId={model.downloadingQuestionId}
            isGradingBusy={model.isGradingBusy}
            isBulkSaving={model.isBulkSaving}
            manualAnswersCount={model.manualAnswersCount}
            gradedCount={model.gradedCount}
            answerToDelete={model.answerToDelete}
            onRefresh={() => void model.loadAttemptDetails()}
            onBulkSave={() => void model.saveBulkGrades()}
            onDownloadFile={(answer) => void model.downloadAnswerFile(answer)}
            onDraftChange={model.updateDraft}
            onSaveGrade={(answer) => void model.saveAnswerGrade(answer)}
            onDeleteGrade={(answer) => void model.setAnswerToDelete(answer)}
            onConfirmDelete={() => {
              if (model.answerToDelete) void model.deleteAnswerGrade(model.answerToDelete)
            }}
            onCancelDelete={() => model.setAnswerToDelete(null)}
          />
        </TabsContent>

        <TabsContent value="deadline">
          <TestAssignmentDeadlinePanel
            assignmentId={model.assignment.id}
            currentDeadline={assignmentDeadline(model.assignment)}
            testTitle={model.assignment.test?.title}
            onUpdated={async () => {
              await model.refetchTests()
            }}
          />
        </TabsContent>

        <TabsContent value="retakes">
          <TestAssignmentRetakePanel
            assignmentId={model.assignment.id}
            currentMaxAttempts={model.assignment.max_attempts}
            testTitle={model.assignment.test?.title}
            onUpdated={async () => {
              await model.refetchTests()
            }}
          />
        </TabsContent>

        <TabsContent value="nextStep">
          <ApplicantTestNextStepTab
            hasAnyResult={model.hasAnyResult}
            nextStep={model.nextStep}
            isPending={model.isStatusPending}
            isTerminalStatus={model.isTerminalStatus}
            allowedSteps={model.allowedNextSteps}
            onNextStepChange={model.setNextStep}
            onApply={() => void model.applyNextStep()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
