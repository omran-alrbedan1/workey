import { BarChart3, FileText, BriefcaseBusiness, ClipboardList, ScanLine } from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ROUTES } from "@/config"
import PageHeader from "@/components/shared/headers/PageHeader"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "overview", path: ROUTES.admin.reports.overview, icon: BarChart3 },
  { label: "applications", path: ROUTES.admin.reports.applications, icon: ClipboardList },
  { label: "jobs", path: ROUTES.admin.reports.jobs, icon: BriefcaseBusiness },
  { label: "cvParsing", path: ROUTES.admin.reports.cvParsing, icon: ScanLine },
]

export default function AdminReportsLayout() {
  const { t } = useTranslation("adminReports")
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={BarChart3} />

      <div className="flex items-center gap-6 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            location.pathname === tab.path ||
            (tab.path === ROUTES.admin.reports.overview &&
              location.pathname === ROUTES.admin.reports.root)
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-0 pb-2 pt-1 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`tabs.${tab.label}`)}
            </button>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
