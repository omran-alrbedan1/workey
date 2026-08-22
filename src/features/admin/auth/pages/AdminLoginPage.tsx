import { ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import Logo from "@/components/shared/logo/Logo"
import { images } from "@/constants/images"
import AdminLoginForm from "../components/AdminLoginForm"

export default function AdminLoginPage() {
  const { t } = useTranslation("adminAuth")
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Logo size="xl" alt={t("logoAlt")} className="mb-8" />
          <div className="mb-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> {t("securePortal")}
            </div>
            <h1 className="text-3xl font-bold text-text-primary">{t("welcome")}</h1>
            <p className="mt-2 text-sm text-text-secondary">{t("description")}</p>
          </div>
          <AdminLoginForm />
        </div>
      </section>
      <section className="hidden min-h-screen overflow-hidden lg:block">
        <img
          src={images.workeyLoginHero}
          alt={t("heroAlt")}
          className="h-screen w-full object-cover"
        />
      </section>
    </main>
  )
}
