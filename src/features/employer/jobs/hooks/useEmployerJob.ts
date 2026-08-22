import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerJobsService } from "../services/employerJobs.service"
import type {
  EmployerJobInput,
  JobScreeningQuestion,
  JobScreeningQuestionInput,
} from "../types/employerJobs.types"

export function useEmployerJob(id?: string | number) {
  const { t } = useTranslation("employerJobs")
  const client = useQueryClient()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ["employer", "jobs", "detail", String(id ?? "")],
    queryFn: () => employerJobsService.get(id!),
    enabled: Boolean(id),
    retry: 1,
  })

  const showJobError = (error: unknown, fallback: string) => {
    showErrorToast(error, fallback)
  }

  const updateMutation = useMutation({
    mutationFn: (input: EmployerJobInput) => employerJobsService.update(id!, input),
    onSuccess: async (job) => {
      client.setQueryData(["employer", "jobs", "detail", String(id)], job)
      await client.invalidateQueries({ queryKey: ["employer", "jobs", "list"] })
      showSuccessToast(t("toasts.updated"))
      navigate(ROUTES.employer.jobs)
    },
    onError: (error) => {
      showJobError(error, t("errors.editDescription"))
    },
  })
  const refreshJob = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: ["employer", "jobs", "detail", String(id)] }),
      client.invalidateQueries({ queryKey: ["employer", "jobs", "list"] }),
    ])
  const attachSkillsMutation = useMutation({
    mutationFn: (skillIds: Array<string | number>) =>
      employerJobsService.attachSkills(id!, skillIds),
    onSuccess: async () => {
      await refreshJob()
      showSuccessToast(t("toasts.skillsAttached"))
    },
    onError: (error) => {
      showJobError(error, t("errors.description"))
    },
  })
  const detachSkillMutation = useMutation({
    mutationFn: (skillId: string | number) => employerJobsService.detachSkill(id!, skillId),
    onSuccess: async () => {
      await refreshJob()
      showSuccessToast(t("toasts.skillDetached"))
    },
    onError: (error) => {
      showJobError(error, t("errors.description"))
    },
  })

  const screeningQuestionsQuery = useQuery({
    queryKey: ["employer", "jobs", "screening-questions", String(id ?? "")],
    queryFn: () => employerJobsService.listScreeningQuestions(id!),
    enabled: Boolean(id),
  })

  const refreshScreeningQuestions = () =>
    client.invalidateQueries({
      queryKey: ["employer", "jobs", "screening-questions", String(id)],
    })

  const createScreeningQuestionMutation = useMutation({
    mutationFn: (input: JobScreeningQuestionInput) =>
      employerJobsService.createScreeningQuestion(id!, input),
    onSuccess: async () => {
      await refreshScreeningQuestions()
      showSuccessToast(t("screeningQuestions.toasts.created"))
    },
    onError: (error) => {
      showJobError(error, t("errors.editDescription"))
    },
  })

  const updateScreeningQuestionMutation = useMutation({
    mutationFn: ({
      questionId,
      input,
    }: {
      questionId: string | number
      input: Partial<JobScreeningQuestionInput>
    }) => employerJobsService.updateScreeningQuestion(id!, questionId, input),
    onSuccess: async () => {
      await refreshScreeningQuestions()
      showSuccessToast(t("screeningQuestions.toasts.updated"))
    },
    onError: (error) => {
      showJobError(error, t("errors.editDescription"))
    },
  })

  const deleteScreeningQuestionMutation = useMutation({
    mutationFn: (questionId: string | number) =>
      employerJobsService.deleteScreeningQuestion(id!, questionId),
    onSuccess: async () => {
      await refreshScreeningQuestions()
      showSuccessToast(t("screeningQuestions.toasts.deleted"))
    },
    onError: (error) => {
      showJobError(error, t("errors.editDescription"))
    },
  })

  return {
    ...query,
    updateMutation,
    attachSkillsMutation,
    detachSkillMutation,
    screeningQuestions: screeningQuestionsQuery.data ?? ([] as JobScreeningQuestion[]),
    isScreeningQuestionsLoading: screeningQuestionsQuery.isPending,
    createScreeningQuestionMutation,
    updateScreeningQuestionMutation,
    deleteScreeningQuestionMutation,
  }
}
