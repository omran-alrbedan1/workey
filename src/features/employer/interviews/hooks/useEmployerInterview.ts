import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type {
  EmployerInterviewAttendanceInput,
  EmployerInterviewCancelInput,
  EmployerInterviewNoShowInput,
  EmployerInterviewRescheduleInput,
  EmployerInterviewUpdateInput,
} from "../types/employerInterviews.types"

export function useEmployerInterview(interviewId?: string | number) {
  const { t } = useTranslation("employerInterviews")
  const client = useQueryClient()
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ["employer", "interviews", "detail", String(interviewId ?? "")],
    queryFn: () => employerInterviewsService.get(interviewId!),
    enabled: Boolean(interviewId),
  })

  const updateMutation = useMutation({
    mutationFn: (input: EmployerInterviewUpdateInput) =>
      employerInterviewsService.update(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.updated"))
      navigate(ROUTES.employer.interviews)
    },
  })

  // Inline "private notes" save from the HR assistance panel — stays on the page.
  const noteMutation = useMutation({
    mutationFn: (internalNote: string) =>
      employerInterviewsService.update(interviewId!, { internal_note: internalNote }),
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["employer", "interviews", "detail", String(interviewId ?? "")],
      })
      showSuccessToast(t("toasts.updated"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => employerInterviewsService.remove(interviewId!),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.deleted"))
      navigate(ROUTES.employer.interviews)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (input: EmployerInterviewCancelInput) =>
      employerInterviewsService.cancel(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.cancelled"))
    },
  })

  const rescheduleMutation = useMutation({
    mutationFn: (input: EmployerInterviewRescheduleInput) =>
      employerInterviewsService.reschedule(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.updated"))
    },
  })

  const completeMutation = useMutation({
    mutationFn: (completionNote?: string) =>
      employerInterviewsService.complete(interviewId!, { completion_note: completionNote }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.completed"))
    },
  })

  const attendanceMutation = useMutation({
    mutationFn: (input: EmployerInterviewAttendanceInput) =>
      employerInterviewsService.recordAttendance(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.attendanceUpdated"))
    },
  })

  const noShowMutation = useMutation({
    mutationFn: (input: EmployerInterviewNoShowInput) =>
      employerInterviewsService.markNoShow(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.noShowMarked"))
    },
  })

  const evaluateMutation = useMutation({
    mutationFn: (input: Parameters<typeof employerInterviewsService.evaluate>[1]) =>
      employerInterviewsService.evaluate(interviewId!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.evaluated"))
    },
  })

  return {
    ...query,
    updateMutation,
    noteMutation,
    rescheduleMutation,
    deleteMutation,
    cancelMutation,
    completeMutation,
    attendanceMutation,
    noShowMutation,
    evaluateMutation,
  }
}
