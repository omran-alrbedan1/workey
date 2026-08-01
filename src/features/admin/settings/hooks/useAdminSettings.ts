import { useMemo } from "react"
import { adminSettingsService } from "../services/adminSettings.service"
export function useAdminSettings() {
  return useMemo(() => adminSettingsService.get(), [])
}
