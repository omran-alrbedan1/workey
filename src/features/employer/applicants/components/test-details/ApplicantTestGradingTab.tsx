import { CheckCircle2, Download, FileText, Loader2, RotateCcw, Save, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@/components/shared/badges"
import { DeleteModal } from "@/components/shared/modals"
import { EmptyState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { valueOf } from "@/lib/keyValue"
import type { TestAttemptResultBreakdownItem } from "@/features/employer/tests/types/employerTests.types"
import {
  canManuallyGrade,
  selectedAnswer,
  type GradeDraft,
} from "./testDetails.helpers"

interface ApplicantTestGradingTabProps {
  activeAttemptId: string | number | null
  answers: TestAttemptResultBreakdownItem[]
  drafts: Record<string, GradeDraft>
  loadingDetails: boolean
  submitted: boolean
  downloadingQuestionId: string | number | null
  isGradingBusy: boolean
  isBulkSaving: boolean
  manualAnswersCount: number
  gradedCount: number
  answerToDelete: TestAttemptResultBreakdownItem | null
  onRefresh: () => void
  onBulkSave: () => void
  onDownloadFile: (answer: TestAttemptResultBreakdownItem) => void
  onDraftChange: (questionId: string | number, field: keyof GradeDraft, value: string) => void
  onSaveGrade: (answer: TestAttemptResultBreakdownItem) => void
  onDeleteGrade: (answer: TestAttemptResultBreakdownItem) => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
}

export default function ApplicantTestGradingTab({
  activeAttemptId,
  answers,
  drafts,
  loadingDetails,
  submitted,
  downloadingQuestionId,
  isGradingBusy,
  isBulkSaving,
  manualAnswersCount,
  gradedCount,
  answerToDelete,
  onRefresh,
  onBulkSave,
  onDownloadFile,
  onDraftChange,
  onSaveGrade,
  onDeleteGrade,
  onConfirmDelete,
  onCancelDelete,
}: ApplicantTestGradingTabProps) {
  const { t } = useTranslation("employerApplicants")
  const progressPercent = manualAnswersCount > 0 ? Math.round((gradedCount / manualAnswersCount) * 100) : 0

  return (
    <>
      <Card>
        <CardHeader className="sticky top-0 z-10 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t("tests.gradingTitle")}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={!activeAttemptId}>
                <RotateCcw className="h-4 w-4" />
                {t("tests.refreshResult")}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!activeAttemptId || manualAnswersCount === 0 || isGradingBusy}
                onClick={onBulkSave}
              >
                {isBulkSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t("tests.bulkSave")}
              </Button>
            </div>
          </div>
          {!loadingDetails && manualAnswersCount > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  {t("tests.gradingProgress", { graded: gradedCount, total: manualAnswersCount })}
                </span>
                <span className="font-medium text-text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingDetails ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : answers.length === 0 ? (
            <EmptyState
              title={submitted ? t("tests.noAnswers") : t("tests.notSubmittedHint")}
              description={submitted ? t("tests.noAnswersDescription", { defaultValue: "The candidate has not submitted any answers yet." }) : t("tests.notSubmittedDescription", { defaultValue: "This test has not been submitted yet." })}
              icon={CheckCircle2}
              className="py-8 bg-transparent"
            />
          ) : (
            answers.map((answer, index) => {
              const isGraded = answer.awarded_points != null
              return (
                <AnswerGradeCard
                  key={answer.question_id}
                  answer={answer}
                  index={index}
                  draft={drafts[String(answer.question_id)] ?? { awarded_points: "", reviewer_note: "" }}
                  downloading={downloadingQuestionId === answer.question_id}
                  isGradingBusy={isGradingBusy}
                  isGraded={isGraded}
                  onDownloadFile={onDownloadFile}
                  onDraftChange={onDraftChange}
                  onSaveGrade={onSaveGrade}
                  onDeleteGrade={onDeleteGrade}
                />
              )
            })
          )}
        </CardContent>
      </Card>

      <DeleteModal
        open={answerToDelete !== null}
        name={answerToDelete ? `${t("tests.gradeFor")} Q${answers.indexOf(answerToDelete) + 1}` : ""}
        loading={isGradingBusy}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}

interface AnswerGradeCardProps {
  answer: TestAttemptResultBreakdownItem
  index: number
  draft: GradeDraft
  downloading: boolean
  isGradingBusy: boolean
  isGraded: boolean
  onDownloadFile: (answer: TestAttemptResultBreakdownItem) => void
  onDraftChange: (questionId: string | number, field: keyof GradeDraft, value: string) => void
  onSaveGrade: (answer: TestAttemptResultBreakdownItem) => void
  onDeleteGrade: (answer: TestAttemptResultBreakdownItem) => void
}

function AnswerGradeCard({
  answer,
  index,
  draft,
  downloading,
  isGradingBusy,
  isGraded,
  onDownloadFile,
  onDraftChange,
  onSaveGrade,
  onDeleteGrade,
}: AnswerGradeCardProps) {
  const { t } = useTranslation("employerApplicants")
  const maxPoints = Number(answer.max_points ?? 0)
  const manual = canManuallyGrade(answer)

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isGraded
          ? "border-l-4 border-l-green-500 border border-border"
          : "border-border"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {index + 1}. {answer.question_text || t("tests.unknownQuestion")}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {String(valueOf(answer.question_type, "-"))} - {maxPoints} {t("tests.points")}
          </p>
        </div>
        {isGraded && <StatusBadge status="reviewed" variant="soft" size="sm" />}
      </div>

      <div className="mt-3 rounded-md bg-muted/40 p-3">
        <p className="mb-1 text-xs font-medium text-text-muted">{t("tests.candidateAnswer")}</p>
        <p className="whitespace-pre-wrap text-sm">{selectedAnswer(answer)}</p>
        {answer.file?.download_available && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            disabled={downloading}
            onClick={() => onDownloadFile(answer)}
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {answer.file.original_name ?? t("tests.downloadFile")}
          </Button>
        )}
      </div>

      {manual ? (
        <ManualGradeForm
          answer={answer}
          draft={draft}
          maxPoints={maxPoints}
          isGradingBusy={isGradingBusy}
          onDraftChange={onDraftChange}
          onSaveGrade={onSaveGrade}
          onDeleteGrade={onDeleteGrade}
        />
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3 text-sm text-text-muted">
          <FileText className="h-4 w-4" />
          {answer.awarded_points == null
            ? t("tests.autoGradePending")
            : t("tests.autoGradeResult", {
                score: answer.awarded_points,
                max: maxPoints,
              })}
        </div>
      )}
    </div>
  )
}

interface ManualGradeFormProps {
  answer: TestAttemptResultBreakdownItem
  draft: GradeDraft
  maxPoints: number
  isGradingBusy: boolean
  onDraftChange: (questionId: string | number, field: keyof GradeDraft, value: string) => void
  onSaveGrade: (answer: TestAttemptResultBreakdownItem) => void
  onDeleteGrade: (answer: TestAttemptResultBreakdownItem) => void
}

function ManualGradeForm({
  answer,
  draft,
  maxPoints,
  isGradingBusy,
  onDraftChange,
  onSaveGrade,
  onDeleteGrade,
}: ManualGradeFormProps) {
  const { t } = useTranslation("employerApplicants")
  const questionId = answer.question_id

  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr_auto]">
      <div className="space-y-2">
        <Label htmlFor={`grade-${questionId}`}>{t("tests.awardedPoints", { max: maxPoints })}</Label>
        <Input
          id={`grade-${questionId}`}
          type="number"
          min={0}
          max={maxPoints}
          step={0.5}
          value={draft.awarded_points}
          onChange={(event) => onDraftChange(questionId, "awarded_points", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`note-${questionId}`}>{t("tests.reviewerNote")}</Label>
        <Textarea
          id={`note-${questionId}`}
          rows={2}
          value={draft.reviewer_note}
          onChange={(event) => onDraftChange(questionId, "reviewer_note", event.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={isGradingBusy}
          onClick={() => onSaveGrade(answer)}
          aria-label={t("tests.saveGrade")}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-red-500 hover:bg-red-50"
          disabled={isGradingBusy || answer.awarded_points == null}
          onClick={() => onDeleteGrade(answer)}
          aria-label={t("tests.deleteGrade")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
