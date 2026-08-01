import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type { ApplicationInternalNoteInput, ApplicationInternalNoteUpdateInput } from "../types/employerApplicants.types"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

export function useInternalNotes(applicationId: string | number | undefined) {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ["internalNotes", applicationId],
    queryFn: () => employerApplicantsService.listInternalNotes(applicationId!, 1, false),
    enabled: !!applicationId,
  })

  const createMutation = useMutation({
    mutationFn: (input: ApplicationInternalNoteInput) =>
      employerApplicantsService.createInternalNote(applicationId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internalNotes", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["employerApplicantDetail", applicationId] })
      showSuccessToast("Internal note created")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create note"
      if (error?.response?.data?.code === "APPLICATION_INTERNAL_NOTES_READ_ONLY") {
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
      queryClient.invalidateQueries({ queryKey: ["internalNotes", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["employerApplicantDetail", applicationId] })
      showSuccessToast("Internal note updated")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update note"
      if (error?.response?.data?.code === "APPLICATION_INTERNAL_NOTE_EDIT_WINDOW_EXPIRED") {
        showErrorToast("Edit window has expired (15 minutes)")
      } else if (error?.response?.data?.code === "APPLICATION_INTERNAL_NOTE_VERSION_CONFLICT") {
        showErrorToast("Version conflict - note was modified by someone else")
      } else {
        showErrorToast(message)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ noteId, version }: { noteId: string | number; version: number }) =>
      employerApplicantsService.deleteInternalNote(noteId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internalNotes", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["employerApplicantDetail", applicationId] })
      showSuccessToast("Internal note deleted")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete note"
      showErrorToast(message)
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
