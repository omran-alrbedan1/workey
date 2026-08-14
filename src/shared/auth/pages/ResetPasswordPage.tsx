import { useTranslation } from "react-i18next"

import { images } from "@/constants/images"
import ResetPasswordForm from "../components/ResetPasswordForm"

export default function ResetPasswordPage({ loginPath }: { loginPath: string }) {
  const { t } = useTranslation("authPassword")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <img src={images.logo} alt="Workey" className="mb-8 h-24 w-auto" />
        <h1 className="text-3xl font-bold text-text-primary">{t("reset.title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t("reset.description")}
        </p>
        <ResetPasswordForm loginPath={loginPath} />
      </div>
    </main>
  )
}
