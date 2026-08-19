import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/shared/badges"
import type { ApplicationStatus, ApplicationStatusKey } from "../types/employerApplicants.types"

interface ApplicationStatusChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: ApplicationStatus | null
  targetStatus: ApplicationStatusKey | null
  onConfirm: (note?: string) => void
  isSubmitting: boolean
  requireNote?: boolean
}

export default function ApplicationStatusChangeDialog({
  open,
  onOpenChange,
  currentStatus,
  targetStatus,
  onConfirm,
  isSubmitting,
  requireNote = false,
}: ApplicationStatusChangeDialogProps) {
  const { t } = useTranslation("employerApplicants")
  const [note, setNote] = useState("")

  const handleConfirm = () => {
    if (requireNote && !note.trim()) return
    onConfirm(note.trim() || undefined)
    setNote("")
  }

  const handleClose = () => {
    onOpenChange(false)
    setNote("")
  }

  const statusesRequiringNote: ApplicationStatusKey[] = ["rejected", "on_hold", "accepted"]

  const shouldRequireNote = requireNote || Boolean(targetStatus && statusesRequiringNote.includes(targetStatus))

  return (
    <Dialog open={open} onOpenChange={() => !isSubmitting && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            {t("statusChange.title")}
          </DialogTitle>
          <DialogDescription>
            {t("statusChange.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Status Transition Display */}
          <div className="flex items-center justify-center gap-3">
            <StatusBadge
              status={(currentStatus?.key as any) || "unknown"}
              label={currentStatus?.value || t("statuses.unknown")}
              variant="soft"
            />
            <ArrowRight className="h-4 w-4 text-text-muted" />
            <StatusBadge
              status={(targetStatus as any) || "unknown"}
              label={t(`statuses.${targetStatus}`, { defaultValue: targetStatus || "" })}
              variant="soft"
            />
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label htmlFor="status-note" className="text-sm font-medium text-text-primary">
              {t("statusChange.noteLabel")}
              {shouldRequireNote && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              id="status-note"
              placeholder={t("statusChange.notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              required={shouldRequireNote}
            />
            {shouldRequireNote && !note.trim() && (
              <p className="text-xs text-red-600">{t("statusChange.noteRequired")}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("actions.cancel")}
          </Button>
          <SubmitButton
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText={t("actions.processing")}
            text={t("actions.confirm")}
            disabled={shouldRequireNote && !note.trim()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
