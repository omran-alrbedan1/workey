import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Clock, Edit2, History, Plus, Trash2, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useInternalNotes } from "../hooks/useInternalNotes"
import InternalNoteDialog from "./InternalNoteDialog"
import InternalNoteRevisionsDialog from "./InternalNoteRevisionsDialog"
import { DeleteModal } from "@/components/shared/modals"
import EmptyState from "@/components/shared/states/EmptyState"

export default function InternalNotes({
  applicationId,
  canCreate = true,
}: {
  applicationId: string | number
  canCreate?: boolean
}) {
  const { t } = useTranslation("employerApplicants")
  const {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInternalNotes(applicationId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<{
    id: string | number
    body: string
    version: number
  } | null>(null)
  const [deleteNoteId, setDeleteNoteId] = useState<{ id: string | number; version: number } | null>(
    null,
  )
  const [historyNoteId, setHistoryNoteId] = useState<string | number | undefined>()

  const handleCreate = () => {
    if (!canCreate) return
    setEditingNote(null)
    setDialogOpen(true)
  }

  const handleEdit = (note: { id: string | number; body: string; version: number }) => {
    setEditingNote(note)
    setDialogOpen(true)
  }

  const handleDelete = (noteId: string | number, version: number) => {
    setDeleteNoteId({ id: noteId, version })
  }

  const handleSubmit = (body: string) => {
    if (editingNote) {
      updateNote({ noteId: editingNote.id, input: { body, version: editingNote.version } })
    } else {
      createNote({ body })
    }
    setDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (deleteNoteId) {
      deleteNote({ noteId: deleteNoteId.id, version: deleteNoteId.version })
      setDeleteNoteId(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {t("internalNotes.title")}
          </CardTitle>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={isCreating || !canCreate}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("internalNotes.addNote")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.length === 0 ? (
            <EmptyState
              title={t("internalNotes.empty")}
              description={t("internalNotes.emptyDescription")}
              icon={MessageSquare}
              primaryAction={
                canCreate
                  ? {
                      label: t("internalNotes.addNote"),
                      onClick: handleCreate,
                      icon: Plus,
                    }
                  : undefined
              }
            />
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 whitespace-pre-wrap text-sm text-text-primary">
                    {note.body}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setHistoryNoteId(note.id)}
                      title={t("internalNotes.viewRevisions")}
                    >
                      <History className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() =>
                        handleEdit({ id: note.id, body: note.body || "", version: note.version })
                      }
                      disabled={isUpdating || note.can_edit === false}
                      title={t("internalNotes.editNote")}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(note.id, note.version)}
                      disabled={isDeleting || note.can_delete === false}
                      title={t("internalNotes.deleteNote")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{note.author?.name || t("unknownCandidate")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{note.created_at ? new Date(note.created_at).toLocaleString() : ""}</span>
                  </div>
                  <span>v{note.version}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <InternalNoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialBody={editingNote?.body || ""}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
      <InternalNoteRevisionsDialog
        noteId={historyNoteId}
        open={historyNoteId !== undefined}
        onOpenChange={(open) => {
          if (!open) setHistoryNoteId(undefined)
        }}
      />
      <DeleteModal
        open={deleteNoteId !== null}
        name="internal note"
        loading={isDeleting}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
