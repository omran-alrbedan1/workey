import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type { GenerateCvSummaryInput } from "../types/employerApplicants.types"

function errorMessage(error: any, fallback: string) {
  const code = error?.code ?? error?.response?.data?.code
  if (code === "CV_SUMMARY_SOURCE_UNAVAILABLE")
    return "No usable CV source is available for this application."
  if (code === "CV_SUMMARY_NOT_CONFIGURED")
    return "CV summary generation is not configured on the backend."
  if (code === "CV_SUMMARY_TIMEOUT") return "CV summary generation timed out. Please try again."
  return error?.message ?? error?.response?.data?.message ?? fallback
}

export function useApplicationCvSummary(applicationId: string | number | undefined) {
  const queryClient = useQueryClient()
  const queryKey = ["applicationCvSummary", applicationId]

  const summaryQuery = useQuery({
    queryKey,
    queryFn: () => employerApplicantsService.getCvSummary(applicationId!),
    enabled: !!applicationId,
  })

  const generateMutation = useMutation({
    mutationFn: (input: GenerateCvSummaryInput = {}) =>
      employerApplicantsService.generateCvSummary(applicationId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      showSuccessToast("CV summary generated")
    },
    onError: (error: any) => {
      showErrorToast(errorMessage(error, "Failed to generate CV summary"))
    },
  })

  return {
    summary: summaryQuery.data ?? null,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    isGenerating: generateMutation.isPending,
    refetch: summaryQuery.refetch,
    generate: generateMutation.mutate,
  }
}
