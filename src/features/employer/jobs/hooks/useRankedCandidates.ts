import { useQuery } from "@tanstack/react-query"
import { employerJobsService } from "../services/employerJobs.service"

export function useRankedCandidates(jobId?: string | number) {
  return useQuery({
    queryKey: ["employer", "jobs", "ranked-candidates", String(jobId ?? "")],
    queryFn: () => employerJobsService.rankedCandidates(jobId!),
    enabled: Boolean(jobId),
  })
}
