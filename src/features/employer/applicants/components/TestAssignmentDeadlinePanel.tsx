import { useEffect, useState } from "react"
import { CalendarClock, Loader2, RotateCcw, Save } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/shared/states/EmptyState"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { AssignmentDeadlineHistoryItem } from "@/features/employer/tests/types/employerTests.types"

interface TestAssignmentDeadlinePanelProps {
  assignmentId: string | number
  currentDeadline?: string | null
  testTitle?: string
  canManage?: boolean
  onClose?: () => void
  onUpdated?: () => void | Promise<void>
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

function toIsoDeadline(value: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function formatDateTime(value?: string | null, fallback = "-") {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString()
}

export default function TestAssignmentDeadlinePanel({
  assignmentId,
  currentDeadline,
  testTitle,
  canManage = true,
  onClose,
  onUpdated,
}: TestAssignmentDeadlinePanelProps) {
  const { t } = useTranslation("employerApplicants")
  const [deadline, setDeadline] = useState(toDateTimeLocal(currentDeadline))
  const [reason, setReason] = useState("")
  const [history, setHistory] = useState<AssignmentDeadlineHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      setHistory(await employerTestsService.getDeadlineHistory(assignmentId))
    } catch (error) {
      showErrorToast(error, t("tests.deadlineHistoryError"))
      setHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    setDeadline(toDateTimeLocal(currentDeadline))
    setReason("")
    void loadHistory()
  }, [assignmentId, currentDeadline])

  const saveDeadline = async () => {
    if (!canManage) return

    const nextDeadline = toIsoDeadline(deadline)
    if (!nextDeadline || !reason.trim()) {
      showErrorToast(t("tests.deadlineValidation"))
      return
    }

    setSaving(true)
    try {
      await employerTestsService.updateAssignmentDeadline(assignmentId, {
        deadline_at: nextDeadline,
        reason: reason.trim(),
      })
      showSuccessToast(t("tests.toasts.deadlineUpdated"))
      setReason("")
      await loadHistory()
      await onUpdated?.()
    } catch (error) {
      showErrorToast(error, t("tests.deadlineUpdateError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <CalendarClock className="h-4 w-4" />
            {t("tests.deadlineTitle")}
          </h3>
          <p className="text-sm text-text-muted">{testTitle || t("tests.untitled")}</p>
        </div>
        {onClose && (
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t("tests.closeDeadline")}
          </Button>
        )}
      </div>

      <div className="rounded-md border border-border bg-background p-3">
        <p className="text-xs text-text-muted">{t("tests.currentDeadline")}</p>
        <p className="mt-1 text-sm font-medium">{formatDateTime(currentDeadline)}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[220px_1fr_auto]">
        <div className="space-y-2">
          <Label htmlFor={`deadline-${assignmentId}`}>{t("tests.newDeadline")}</Label>
          <Input
            id={`deadline-${assignmentId}`}
            type="datetime-local"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            disabled={saving || !canManage}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`deadline-reason-${assignmentId}`}>{t("tests.deadlineReason")}</Label>
          <Textarea
            id={`deadline-reason-${assignmentId}`}
            rows={2}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t("tests.deadlineReasonPlaceholder")}
            disabled={saving || !canManage}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            disabled={saving || !deadline || !reason.trim() || !canManage}
            onClick={() => void saveDeadline()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t("tests.saveDeadline")}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">{t("tests.deadlineHistory")}</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => void loadHistory()}>
            <RotateCcw className="h-4 w-4" />
            {t("tests.refreshHistory")}
          </Button>
        </div>

        {loadingHistory ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            title={t("tests.deadlineHistoryEmpty")}
            description={t("tests.deadlineHistory")}
            icon={CalendarClock}
            className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
          />
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="rounded-md border border-border bg-background p-3">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {formatDateTime(item.previous_deadline_at)} {"->"}{" "}
                    {formatDateTime(item.new_deadline_at)}
                  </span>
                  <span className="text-xs text-text-muted">{formatDateTime(item.changed_at)}</span>
                </div>
                {item.reason && <p className="mt-2 text-sm text-text-muted">{item.reason}</p>}
                {item.changed_by?.name && (
                  <p className="mt-1 text-xs text-text-muted">
                    {t("tests.deadlineActor", { actor: item.changed_by.name })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
