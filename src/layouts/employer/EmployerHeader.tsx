import { BriefcaseBusiness, LogOut, Menu, Bell } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import LanguageSwitcher from "@/components/shared/buttons/language-switcher"
import { ROUTES } from "@/config"

interface EmployerHeaderProps {
  employerName?: string
  isLoggingOut: boolean
  onLogout: () => void
  onMenuToggle: () => void
}

export default function EmployerHeader({
  employerName,
  isLoggingOut,
  onLogout,
  onMenuToggle,
}: EmployerHeaderProps) {
  const { t } = useTranslation("employerNavigation")
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background-card px-4 py-4 shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={t("openMenu")}
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-text-secondary hover:bg-background-secondary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <BriefcaseBusiness className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {employerName || t("portalName")}
              </p>
              <p className="text-xs text-text-muted">{t("portalLabel")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            aria-label={t("notifications")}
            onClick={() => navigate(ROUTES.employer.notifications)}
            className="relative rounded-full p-2 text-text-secondary transition-colors hover:bg-background-secondary"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute end-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </button>
          <ModeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-background-secondary disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 rtl:rotate-180" />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
