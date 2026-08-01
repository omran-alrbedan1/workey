import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerJobsService } from "../services/employerJobs.service"

export function useCreateEmployerJob() {
  const { t } = useTranslation("employerJobs")
  const client = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: employerJobsService.create,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "jobs"] })
      showSuccessToast(t("toasts.created"))
      navigate(ROUTES.employer.jobs)
    },
  })
}
