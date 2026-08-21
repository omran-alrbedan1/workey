import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type { ApplicationInternalNoteInput, ApplicationInternalNoteUpdateInput } from "../types/employerApplicants.types"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

function apiErrorCode(error: any) {
  return error?.code ?? error?.response?.data?.code
}

function apiErrorMessage(error: any, fallback: string) {
  return error?.message ?? error?.response?.data?.message ?? fallback
}

export function useInternalNotes(applicationId: string | number | undefined) {
  const queryClient = useQueryClient()

  const refreshNotes = () => {
    // Notes never change application data — refresh the notes list only.
    queryClient.invalidateQueries({ queryKey: ["internalNotes", applicationId] })
  }

  const listQuery = useQuery({
    queryKey: ["internalNotes", applicationId],
    queryFn: () => employerApplicantsService.listInternalNotes(applicationId!, 1, false),
    enabled: !!applicationId,
  })

  const createMutation = useMutation({
    mutationFn: (input: ApplicationInternalNoteInput) =>
      employerApplicantsService.createInternalNote(applicationId!, input),
    onSuccess: () => {
      refreshNotes()
      showSuccessToast("Internal note created")
    },
    onError: (error: any) => {
      const message = apiErrorMessage(error, "Failed to create note")
      if (apiErrorCode(error) === "APPLICATION_INTERNAL_NOTES_READ_ONLY") {
        showErrorToast("Cannot add notes to final-state applications")
      } else {
        showErrorToast(message)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ noteId, input }: { noteId: string | number; input: ApplicationInternalNoteUpdateInput }) =>
      employerApplicantsService.updateInternalNote(noteId, input),
    onSuccess: () => {
      refreshNotes()
      showSuccessToast("Internal note updated")
    },
    onError: (error: any) => {
      const message = apiErrorMessage(error, "Failed to update note")
      const code = apiErrorCode(error)
      if (code === "APPLICATION_INTERNAL_NOTE_EDIT_WINDOW_EXPIRED") {
        showErrorToast("Edit window has expired (15 minutes)")
      } else if (code === "APPLICATION_INTERNAL_NOTE_VERSION_CONFLICT") {
        refreshNotes()
        showErrorToast("This note changed elsewhere. I refreshed the notes; reopen it and try again.")
      } else {
        showErrorToast(message)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ noteId, version }: { noteId: string | number; version: number }) =>
      employerApplicantsService.deleteInternalNote(noteId, version),
    onSuccess: () => {
      refreshNotes()
      showSuccessToast("Internal note deleted")
    },
    onError: (error: any) => {
      if (apiErrorCode(error) === "APPLICATION_INTERNAL_NOTE_VERSION_CONFLICT") {
        refreshNotes()
        showErrorToast("This note changed elsewhere. I refreshed the notes; check the latest version before deleting.")
        return
      }
      showErrorToast(apiErrorMessage(error, "Failed to delete note"))
    },
  })

  return {
    notes: listQuery.data?.items ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    createNote: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateNote: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteNote: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}

export function useInternalNoteRevisions(noteId: string | number | undefined) {
  return useQuery({
    queryKey: ["internalNoteRevisions", noteId],
    queryFn: () => employerApplicantsService.listInternalNoteRevisions(noteId!),
    enabled: !!noteId,
  })
}
