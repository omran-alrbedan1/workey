import { useQuery } from "@tanstack/react-query"
import { employerInterviewsService } from "../services/employerInterviews.service"

export function useEmployerInterviews(applicationId?: string | number) {
  return useQuery({
    queryKey: ["employer", "interviews", "list", String(applicationId ?? "")],
    queryFn: () => employerInterviewsService.list(applicationId!),
    enabled: Boolean(applicationId),
  })
}
