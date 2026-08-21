import { Lock, Home, ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"

export default function AccessDeniedPage() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(ROUTES.home)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-background-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-text-primary">{t("errors.accessDenied")}</h1>
        <p className="mt-3 text-sm text-text-secondary">{t("errors.accessDeniedDesc")}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("goBack")}
          </Button>
          <Button onClick={() => navigate(ROUTES.home)}>
            <Home className="mr-2 h-4 w-4" />
            {t("goHome")}
          </Button>
        </div>
      </section>
    </main>
  )
}
