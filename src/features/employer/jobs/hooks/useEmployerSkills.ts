import { useQuery } from "@tanstack/react-query"
import { employerJobsService } from "../services/employerJobs.service"

export function useEmployerSkills() {
  return useQuery({
    queryKey: ["employer", "skills"],
    queryFn: () => employerJobsService.listSkills("", 100),
    staleTime: 10 * 60_000,
  })
}
