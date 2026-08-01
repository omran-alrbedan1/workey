import { useQuery } from "@tanstack/react-query"

import { STORAGE_KEYS } from "@/config"
import { adminAuthService } from "../services/adminAuth.service"

export function useAdminSession() {
  const hasToken =
    typeof window !== "undefined" && Boolean(localStorage.getItem(STORAGE_KEYS.accessToken))
  const query = useQuery({
    queryKey: ["admin", "auth", "me"],
    queryFn: adminAuthService.me,
    enabled: hasToken,
    staleTime: 5 * 60_000,
    retry: false,
  })

  return { ...query, hasToken, isAdmin: query.data?.role.key === "admin" }
}
