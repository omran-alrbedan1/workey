import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerJobsService } from "../services/employerJobs.service"
import type { EmployerJobInput, EmployerJobSkillsInput } from "../types/employerJobs.types"

export interface CreateEmployerJobPayload {
  input: EmployerJobInput & EmployerJobSkillsInput
  shouldPublish?: boolean
}

export function useCreateEmployerJob() {
  const { t } = useTranslation("employerJobs")
  const client = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ input, shouldPublish }: CreateEmployerJobPayload) => {
      const job = await employerJobsService.create(input)
      if (shouldPublish) {
        return employerJobsService.publish(job.id)
      }
      return job
    },
    onSuccess: async (job, { shouldPublish }) => {
      await client.invalidateQueries({ queryKey: ["employer", "jobs"] })
      if (shouldPublish) {
        showSuccessToast(t("toasts.published"))
        navigate(ROUTES.employer.jobDetails(job.id))
      } else {
        showSuccessToast(t("toasts.created"))
        navigate(ROUTES.employer.jobs)
      }
    },
    onError: (error) => {
      showErrorToast(error, t("errors.description"))
    },
  })
}
