import { BriefcaseBusiness } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config"
import Logo from "@/components/shared/logo/Logo"
import EmployerRegisterForm from "../components/EmployerRegisterForm"
import { images } from "@/constants/images"

export default function EmployerRegisterPage() {
  const { t } = useTranslation("employerAuth")

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl">
          <Logo size="lg" alt={t("logoAlt")} className="mb-6" />
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              {t("eyebrow")}
            </div>
            <h1 className="text-3xl font-bold text-text-primary">{t("register.title")}</h1>
            <p className="mt-2 text-sm text-text-secondary">{t("register.description")}</p>
          </div>
          <EmployerRegisterForm />
          <p className="mt-6 text-center text-sm text-text-secondary">
            {t("register.haveAccount")}{" "}
            <Link className="font-semibold text-primary hover:underline" to={ROUTES.employer.login}>
              {t("actions.signIn")}
            </Link>
          </p>
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
