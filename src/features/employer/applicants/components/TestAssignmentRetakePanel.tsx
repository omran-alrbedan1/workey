import { useEffect, useState } from "react"
import { CalendarPlus, History, Loader2, RotateCcw, Save } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import { valueOf } from "@/lib/keyValue"
import type {
  AttemptSeriesItem,
  TestAssignmentSeriesResponse,
} from "@/features/employer/tests/types/employerTests.types"

interface TestAssignmentRetakePanelProps {
  assignmentId: string | number
  currentMaxAttempts?: number | null
  testTitle?: string
  onClose: () => void
  onUpdated?: () => void | Promise<void>
}

function toIsoDateTime(value: string) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function attemptScore(item: AttemptSeriesItem) {
  return item.percentage ?? null
}

export default function TestAssignmentRetakePanel({
  assignmentId,
  currentMaxAttempts,
  testTitle,
  onClose,
  onUpdated,
}: TestAssignmentRetakePanelProps) {
  const { t } = useTranslation("employerApplicants")
  const [maxAttempts, setMaxAttempts] = useState(
    currentMaxAttempts == null ? "" : String(currentMaxAttempts),
  )
  const [policyReason, setPolicyReason] = useState("")
  const [retakeReason, setRetakeReason] = useState("")
  const [instructions, setInstructions] = useState("")
  const [deadline, setDeadline] = useState("")
  const [series, setSeries] = useState<TestAssignmentSeriesResponse | null>(null)
  const [loadingSeries, setLoadingSeries] = useState(false)
  const [savingPolicy, setSavingPolicy] = useState(false)
  const [grantingRetake, setGrantingRetake] = useState(false)

  const loadSeries = async () => {
    setLoadingSeries(true)
    try {
      setSeries(await employerTestsService.getAttemptSeries(assignmentId))
    } catch (error) {
      showErrorToast(error, t("tests.retakeSeriesError"))
      setSeries(null)
    } finally {
      setLoadingSeries(false)
    }
  }

  useEffect(() => {
    setMaxAttempts(currentMaxAttempts == null ? "" : String(currentMaxAttempts))
    setPolicyReason("")
    setRetakeReason("")
    setInstructions("")
    setDeadline("")
    void loadSeries()
  }, [assignmentId, currentMaxAttempts])

  const updatePolicy = async () => {
    const parsedMaxAttempts = Number(maxAttempts)
    if (!Number.isInteger(parsedMaxAttempts) || parsedMaxAttempts < 1 || parsedMaxAttempts > 5 || !policyReason.trim()) {
      showErrorToast(t("tests.retakePolicyValidation"))
      return
    }

    setSavingPolicy(true)
    try {
      await employerTestsService.updateRetakePolicy(assignmentId, {
        max_attempts: parsedMaxAttempts,
        reason: policyReason.trim(),
      })
      showSuccessToast(t("tests.toasts.retakePolicyUpdated"))
      setPolicyReason("")
      await loadSeries()
      await onUpdated?.()
    } catch (error) {
      showErrorToast(error, t("tests.retakePolicyError"))
    } finally {
      setSavingPolicy(false)
    }
  }

  const grantRetake = async () => {
    if (!retakeReason.trim()) {
      showErrorToast(t("tests.retakeReasonValidation"))
      return
    }

    setGrantingRetake(true)
    try {
      await employerTestsService.grantRetake(assignmentId, {
        reason: retakeReason.trim(),
        instructions: instructions.trim() || undefined,
        deadline_at: toIsoDateTime(deadline),
      })
      showSuccessToast(t("tests.toasts.retakeGranted"))
      setRetakeReason("")
      setInstructions("")
      setDeadline("")
      await loadSeries()
      await onUpdated?.()
    } catch (error) {
      showErrorToast(error, t("tests.retakeGrantError"))
    } finally {
      setGrantingRetake(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <History className="h-4 w-4" />
            {t("tests.retakeTitle")}
          </h3>
          <p className="text-sm text-text-muted">{testTitle || t("tests.untitled")}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          {t("tests.closeRetake")}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          <h4 className="text-sm font-semibold">{t("tests.retakePolicy")}</h4>
          <div className="space-y-2">
            <Label htmlFor={`max-attempts-${assignmentId}`}>{t("tests.maxAttempts")}</Label>
            <Input
              id={`max-attempts-${assignmentId}`}
              type="number"
              min={1}
              max={5}
              value={maxAttempts}
              onChange={(event) => setMaxAttempts(event.target.value)}
              disabled={savingPolicy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`retake-policy-reason-${assignmentId}`}>
              {t("tests.retakePolicyReason")}
            </Label>
            <Textarea
              id={`retake-policy-reason-${assignmentId}`}
              rows={2}
              value={policyReason}
              onChange={(event) => setPolicyReason(event.target.value)}
              placeholder={t("tests.retakePolicyReasonPlaceholder")}
              disabled={savingPolicy}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={savingPolicy || !maxAttempts || !policyReason.trim()}
              onClick={() => void updatePolicy()}
            >
              {savingPolicy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("tests.saveRetakePolicy")}
            </Button>
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          <h4 className="text-sm font-semibold">{t("tests.grantRetake")}</h4>
          <div className="space-y-2">
            <Label htmlFor={`retake-reason-${assignmentId}`}>{t("tests.retakeReason")}</Label>
            <Textarea
              id={`retake-reason-${assignmentId}`}
              rows={2}
              value={retakeReason}
              onChange={(event) => setRetakeReason(event.target.value)}
              placeholder={t("tests.retakeReasonPlaceholder")}
              disabled={grantingRetake}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`retake-deadline-${assignmentId}`}>{t("tests.retakeDeadline")}</Label>
            <Input
              id={`retake-deadline-${assignmentId}`}
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              disabled={grantingRetake}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`retake-instructions-${assignmentId}`}>
              {t("tests.retakeInstructions")}
            </Label>
            <Textarea
              id={`retake-instructions-${assignmentId}`}
              rows={2}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder={t("tests.retakeInstructionsPlaceholder")}
              disabled={grantingRetake}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={grantingRetake || !retakeReason.trim()}
              onClick={() => void grantRetake()}
            >
              {grantingRetake ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarPlus className="h-4 w-4" />
              )}
              {t("tests.grantRetake")}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">{t("tests.attemptTimeline")}</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => void loadSeries()}>
            <RotateCcw className="h-4 w-4" />
            {t("tests.refreshTimeline")}
          </Button>
        </div>

        {loadingSeries ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : !series || series.assignments.length === 0 ? (
          <p className="rounded-md border border-border bg-background p-3 text-sm text-text-muted">
            {t("tests.attemptTimelineEmpty")}
          </p>
        ) : (
          <div className="space-y-2">
            <div className="rounded-md border border-border bg-background p-3 text-sm">
              <span className="font-medium">{t("tests.maxAttempts")}:</span> {series.max_attempts}
              <span className="mx-2 text-text-muted">|</span>
              <span className="font-medium">{t("tests.attemptsUsed")}:</span> {series.attempts_used}
              <span className="mx-2 text-text-muted">|</span>
              <span className="font-medium">{t("tests.attemptsRemaining")}:</span> {series.attempts_remaining}
            </div>
            {series.assignments.map((item, index) => {
              const score = attemptScore(item)
              return (
                <div
                  key={item.assignment_id ?? index}
                  className="rounded-md border border-border bg-background p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {t("tests.attemptNumber", {
                          n: item.attempt_number ?? index + 1,
                        })}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {t("tests.submittedAt", { submitted: formatDateTime(item.submitted_at) })}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {t("tests.deadlineLabel", { deadline: formatDateTime(item.deadline_at) })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.is_latest ? "active" : "inactive"} variant="soft" size="sm" />
                      <StatusBadge status={valueOf(item.grading_status, "pending")} variant="soft" size="sm" />
                      <span className="text-sm font-medium">
                        {score == null
                          ? t("tests.noAttemptScore")
                          : t("tests.timelineScore", {
                              score: `${score}%`,
                              max: "-",
                              percentage: item.percentage ?? "-",
                            })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
