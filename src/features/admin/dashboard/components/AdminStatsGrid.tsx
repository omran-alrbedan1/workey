import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  Building2,
  Clock3,
  FlaskConical,
  ShieldAlert,
  UserRoundCheck,
  Users,
  Wrench,
} from "lucide-react"

import type { DashboardMetric, DashboardMetricIcon } from "../types/adminDashboard.types"
import { useTranslation } from "react-i18next"

const icons: Record<DashboardMetricIcon, LucideIcon> = {
  users: Users,
  candidates: UserRoundCheck,
  employers: BriefcaseBusiness,
  companies: Building2,
  pending: Clock3,
  suspended: ShieldAlert,
  skills: Wrench,
  tests: FlaskConical,
}

function AdminStatCard({ metric }: { metric: DashboardMetric }) {
  const { t } = useTranslation("adminDashboard")
  const Icon = icons[metric.icon]

  return (
    <article className="group relative min-h-40 overflow-hidden rounded-[28px] border border-border/60 bg-background-card p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-bold leading-tight text-primary">{metric.label}</h2>
            {metric.approximate && (
              <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                {t("sample")}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-medium text-text-muted">{metric.subtitle}</p>
        </div>
        <p className="text-3xl font-bold tracking-tight text-text-primary">
          {metric.value.toLocaleString()}
          {metric.approximate ? "+" : ""}
        </p>
      </div>
      <div className="absolute bottom-0 end-0 flex h-16 w-16 items-center justify-center">
        <div className="flex h-11 w-11 ltr:translate-x-1 rtl:-translate-x-1 translate-y-1 items-center justify-center rounded-full bg-primary text-white shadow-sm transition group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  )
}

export default function AdminStatsGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <AdminStatCard key={metric.label} metric={metric} />
      ))}
    </div>
  )
}
