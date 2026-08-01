import { adminUsersService } from "@/features/admin/users/services/adminUsers.service"

export const adminCandidatesService = {
  list: (page = 1) => adminUsersService.list({ page, per_page: 15, role: "job_seeker" }),
}
