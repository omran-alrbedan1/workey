import { useQuery } from "@tanstack/react-query"
import { employerInterviewsService } from "@/features/employer/interviews/services/employerInterviews.service"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerInterview } from "@/features/employer/interviews/types/employerInterviews.types"

export function useApplicationInterviews(applicationId?: string | number) {
  return useQuery<EmployerCollection<EmployerInterview>>({
    queryKey: ["application-interviews", applicationId],
    queryFn: () => employerInterviewsService.listForApplication(applicationId!),
    enabled: Boolean(applicationId),
  })
}
