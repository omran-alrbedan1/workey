import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers"

export function useAdminEmployers() {
  return useAdminUsers("employer")
}
