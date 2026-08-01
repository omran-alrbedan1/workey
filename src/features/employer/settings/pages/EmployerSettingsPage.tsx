import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import SecuritySettings from "@/shared/auth/components/SecuritySettings"
import { employerAuthService } from "@/features/employer/auth/services/employerAuth.service"
import { ROUTES } from "@/config"

export default function EmployerSettingsPage() {
  const { t } = useTranslation("employerSettings")
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={Settings} />
      <SecuritySettings clearSession={employerAuthService.clearSession} loginPath={ROUTES.employer.login} />
    </div>
  )
}
