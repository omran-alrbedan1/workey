import { useTranslation } from "react-i18next"
import { History, User } from "lucide-react"

import EmptyState from "@/components/shared/states/EmptyState"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useInternalNoteRevisions } from "../hooks/useInternalNotes"

interface InternalNoteRevisionsDialogProps {
  noteId?: string | number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function InternalNoteRevisionsDialog({
  noteId,
  open,
  onOpenChange,
}: InternalNoteRevisionsDialogProps) {
  const { t } = useTranslation("employerApplicants")
  const { data, isLoading, isError } = useInternalNoteRevisions(open ? noteId : undefined)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t("internalNotes.revisionsTitle")}
          </DialogTitle>
          <DialogDescription>{t("internalNotes.revisionsDescription")}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto py-2 pe-1">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : isError ? (
            <EmptyState
              title={t("internalNotes.revisionsError")}
              description={t("internalNotes.revisionsErrorDescription")}
              icon={History}
            />
          ) : !data || data.length === 0 ? (
            <EmptyState
              title={t("internalNotes.revisionsEmpty")}
              description={t("internalNotes.revisionsEmptyDescription")}
              icon={History}
            />
          ) : (
            data.map((revision) => (
              <div
                key={revision.id}
                className="space-y-3 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">v{revision.version}</Badge>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <User className="h-3 w-3" />
                    <span>{revision.actor?.name || t("unknownCandidate")}</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {revision.created_at ? new Date(revision.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-text-primary">
                  {revision.body || t("internalNotes.revisionBodyEmpty")}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
