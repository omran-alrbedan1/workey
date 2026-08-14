import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { images } from "@/constants/images"
import ForgotPasswordForm from "../components/ForgotPasswordForm"

export default function ForgotPasswordPage({ loginPath }: { loginPath: string }) {
  const { t } = useTranslation("authPassword")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <img src={images.logo} alt="Workey" className="mb-8 h-24 w-auto" />
        <h1 className="text-3xl font-bold text-text-primary">{t("forgot.title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t("forgot.description")}
        </p>
        <ForgotPasswordForm />
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" to={loginPath}>
          <ArrowLeft className="h-4 w-4" /> {t("forgot.back")}
        </Link>
      </div>
    </main>
  )
}
