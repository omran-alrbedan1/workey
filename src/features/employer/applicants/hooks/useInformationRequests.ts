import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type {
  InformationRequestInput,
  InformationRequestUpdateInput,
  CancelInformationRequestInput,
} from "../types/employerApplicants.types"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

function apiErrorCode(error: any) {
  return error?.code ?? error?.response?.data?.code
}

function apiErrorMessage(error: any, fallback: string) {
  return error?.message ?? error?.response?.data?.message ?? fallback
}

/**
 * Refreshes only the queries an information-request action can affect:
 * the request list itself and the application detail (status may move to
 * need_more_information).
 */
function useRefreshAfterRequestChange(applicationId: string | number | undefined) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["informationRequests", applicationId] })
    queryClient.invalidateQueries({ queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")] })
  }
}

export function useInformationRequests(applicationId: string | number | undefined) {
  const queryClient = useQueryClient()
  const refreshAfterChange = useRefreshAfterRequestChange(applicationId)

  const listQuery = useQuery({
    queryKey: ["informationRequests", applicationId],
    queryFn: () => employerApplicantsService.listInformationRequests(applicationId!),
    enabled: !!applicationId,
  })

  const createMutation = useMutation({
    mutationFn: (input: InformationRequestInput) =>
      employerApplicantsService.createInformationRequest(applicationId!, input),
    onSuccess: () => {
      refreshAfterChange()
      showSuccessToast("Information request created")
    },
    onError: (error: any) => {
      const message = apiErrorMessage(error, "Failed to create information request")
      if (apiErrorCode(error) === "APPLICATION_INFORMATION_REQUEST_ALREADY_OPEN") {
        showErrorToast("A pending information request already exists")
      } else {
        showErrorToast(message)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ requestId, input }: { requestId: string | number; input: InformationRequestUpdateInput }) =>
      employerApplicantsService.updateInformationRequest(requestId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["informationRequests", applicationId] })
      showSuccessToast("Information request updated")
    },
    onError: (error: any) => {
      showErrorToast(apiErrorMessage(error, "Failed to update information request"))
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ requestId, input }: { requestId: string | number; input: CancelInformationRequestInput }) =>
      employerApplicantsService.cancelInformationRequest(requestId, input),
    onSuccess: () => {
      refreshAfterChange()
      showSuccessToast("Information request cancelled")
    },
    onError: (error: any) => {
      showErrorToast(apiErrorMessage(error, "Failed to cancel information request"))
    },
  })

  return {
    requests: listQuery.data?.items ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    createRequest: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRequest: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    cancelRequest: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  }
}

export function useInformationRequest(requestId: string | number | undefined) {
  return useQuery({
    queryKey: ["informationRequest", requestId],
    queryFn: () => employerApplicantsService.getInformationRequest(requestId!),
    enabled: !!requestId,
  })
}

export function useDownloadAttachment() {
  return {
    downloadAttachment: async (attachmentId: string | number, fileName: string) => {
      try {
        const blob = await employerApplicantsService.downloadInformationResponseAttachment(attachmentId)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showSuccessToast("Attachment downloaded")
      } catch (error: any) {
        showErrorToast(apiErrorMessage(error, "Failed to download attachment"))
      }
    },
  }
}
