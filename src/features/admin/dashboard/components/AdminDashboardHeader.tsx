import { CalendarDays, RefreshCw, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface AdminDashboardHeaderProps {
  isFetching: boolean
  onRefresh: () => void
}

export default function AdminDashboardHeader({ isFetching, onRefresh }: AdminDashboardHeaderProps) {
  const { t, i18n } = useTranslation("adminDashboard")
  const currentDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date())

  return (
    <section className="relative min-h-44 overflow-hidden rounded-2xl bg-gradient-primary p-6 text-white shadow-soft sm:p-8">
      <div className="absolute -end-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 end-24 h-48 w-48 rounded-full bg-secondary/30" />

      <div className="relative flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("eyebrow")}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">{t("description")}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
            <CalendarDays className="h-4 w-4" />
            {currentDate}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isFetching}
          className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
          {t("refresh")}
        </Button>
      </div>
    </section>
  )
}
