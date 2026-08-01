import type { LucideIcon } from "lucide-react"
import { AlertTriangle, ArrowUpRight, ClipboardList, Clock3 } from "lucide-react"
import { Link } from "react-router-dom"

import type { AttentionItem } from "../types/adminDashboard.types"
import DashboardPanel from "./DashboardPanel"
import { useTranslation } from "react-i18next"

const icons: Record<AttentionItem["tone"], LucideIcon> = {
  warning: Clock3,
  danger: AlertTriangle,
  info: ClipboardList,
}

const styles: Record<AttentionItem["tone"], string> = {
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  info: "bg-primary/10 text-primary",
}

export default function AdminAttentionQueue({ items }: { items: AttentionItem[] }) {
  const { t } = useTranslation("adminDashboard")
  return (
    <DashboardPanel title={t("attentionTitle")} subtitle={t("attentionSubtitle")}>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = icons[item.tone]
          return (
            <Link
              key={item.id}
              to={item.route}
              className="group flex items-center gap-3 rounded-xl border border-border/70 p-3.5 transition hover:border-primary/40 hover:bg-background-secondary"
            >
              <div className={`rounded-lg p-2 ${styles[item.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <p className="truncate text-xs text-text-muted">{item.description}</p>
              </div>
              <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-bold text-text-primary">
                {item.count}
              </span>
              <ArrowUpRight className="h-4 w-4 text-text-muted transition group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </DashboardPanel>
  )
}
