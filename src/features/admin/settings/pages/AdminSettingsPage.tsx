import { Settings } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminSettingsDetails from "../components/AdminSettingsDetails"
import { useAdminSettings } from "../hooks/useAdminSettings"
import { useTranslation } from "react-i18next"
import SecuritySettings from "@/shared/auth/components/SecuritySettings"
import { adminAuthService } from "@/features/admin/auth/services/adminAuth.service"
import { ROUTES } from "@/config"
export default function AdminSettingsPage() {
  const { t } = useTranslation("adminSettings")
  const settings = useAdminSettings()
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={Settings} />
      <AdminSettingsDetails settings={settings} />
      <SecuritySettings
        clearSession={adminAuthService.clearSession}
        loginPath={ROUTES.auth.login}
      />
    </div>
  )
}
