import type { LucideIcon } from "lucide-react"
import { ArrowLeft, Construction } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config"
import { useTranslation } from "react-i18next"

interface AdminSectionPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function AdminSectionPage({
  title,
  description,
  icon: Icon,
}: AdminSectionPageProps) {
  const { t } = useTranslation("adminShared")
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">{t("section.workspace")}</p>
        <h1 className="mt-1 text-2xl font-bold text-text-primary">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">{description}</p>
      </div>

      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background-card p-8 text-center">
        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <Construction className="mt-6 h-5 w-5 text-text-muted" />
        <h2 className="mt-3 font-semibold text-text-primary">{t("section.ready")}</h2>
        <p className="mt-1 max-w-md text-sm text-text-muted">{t("section.description")}</p>
        <Link
          to={ROUTES.admin.root}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("section.back")}
        </Link>
      </div>
    </section>
  )
}
