import { API_CONFIG, APP_CONFIG } from "@/config"
import type { AdminSettingsView } from "../types/adminSettings.types"
export const adminSettingsService = {
  get(): AdminSettingsView {
    return {
      appName: APP_CONFIG.name,
      description: APP_CONFIG.description,
      version: APP_CONFIG.version,
      supportEmail: APP_CONFIG.supportEmail,
      apiBaseUrl: API_CONFIG.baseUrl,
      defaultLocale: APP_CONFIG.locale,
      defaultTheme: APP_CONFIG.theme,
      pageSize: APP_CONFIG.pagination.defaultPageSize,
    }
  },
}
