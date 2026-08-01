import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers"

export function useAdminCandidates() {
  return useAdminUsers("job_seeker")
}
