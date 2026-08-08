import { useQuery } from "@tanstack/react-query"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type { EmployerInterviewListParams } from "../types/employerInterviews.types"

export function useEmployerInterviews(params: EmployerInterviewListParams = {}) {
  return useQuery({
    queryKey: ["employer", "interviews", "list", params],
    queryFn: () => employerInterviewsService.list(params),
  })
}
