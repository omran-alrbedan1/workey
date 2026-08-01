import { useQuery } from "@tanstack/react-query"
import { STORAGE_KEYS } from "@/config"
import { employerAuthService } from "../services/employerAuth.service"

export function useEmployerSession() {
  const hasToken =
    typeof window !== "undefined" && Boolean(localStorage.getItem(STORAGE_KEYS.accessToken))
  const query = useQuery({
    queryKey: ["employer", "auth", "me"],
    queryFn: employerAuthService.me,
    enabled: hasToken,
    staleTime: 5 * 60_000,
    retry: false,
  })

  return { ...query, hasToken, isEmployer: query.data?.role.key === "employer" }
}
