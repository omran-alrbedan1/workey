import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"
import { useEmployerLogout } from "@/features/employer/auth/hooks/useEmployerLogout"
import { useEmployerSession } from "@/features/employer/auth/hooks/useEmployerSession"
import { LogoutModal } from "@/components/shared/modals"
import EmployerHeader from "./EmployerHeader"
import EmployerSidebar from "./EmployerSidebar"

export default function EmployerLayout() {
  const { t } = useTranslation("employerNavigation")
  const session = useEmployerSession()
  const logout = useEmployerLogout()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    logout.mutate()
    setShowLogoutModal(false)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden lg:block">
        <EmployerSidebar />
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label={t("closeMenu")}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`relative h-full w-64 transition-transform duration-300 ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "ltr:-translate-x-full rtl:translate-x-full"
          }`}
        >
          <EmployerSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <EmployerHeader
          employerName={session.data?.name}
          isLoggingOut={logout.isPending}
          onLogout={handleLogoutClick}
          onMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
        />
        <main className="flex-1 overflow-auto bg-background p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onClose={() => setShowLogoutModal(false)}
        loading={logout.isPending}
      />
    </div>
  )
}
