import type { LucideIcon } from "lucide-react"
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FlaskConical,
  LayoutDashboard,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"
import Logo from "@/components/shared/logo/Logo"
import { ROUTES } from "@/config"

interface EmployerSidebarProps {
  onNavigate?: () => void
}

interface EmployerNavigationItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
}

const sections: Array<{ label: string; items: EmployerNavigationItem[] }> = [
  {
    label: "sections.overview",
    items: [
      {
        label: "items.dashboard",
        path: ROUTES.employer.root,
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "sections.recruitment",
    items: [
      { label: "items.jobs", path: ROUTES.employer.jobs, icon: BriefcaseBusiness },
      { label: "items.applicants", path: ROUTES.employer.applicants, icon: UsersRound },
      { label: "items.interviews", path: ROUTES.employer.interviews, icon: CalendarClock },
      { label: "items.tests", path: ROUTES.employer.tests, icon: FlaskConical },
    ],
  },
  {
    label: "sections.organization",
    items: [
      { label: "items.company", path: ROUTES.employer.company, icon: Building2 },
      { label: "items.profile", path: ROUTES.employer.profile, icon: UserRound },
    ],
  },
  {
    label: "sections.account",
    items: [
      { label: "items.notifications", path: ROUTES.employer.notifications, icon: Bell },
      { label: "items.settings", path: ROUTES.employer.settings, icon: Settings },
    ],
  },
]

export default function EmployerSidebar({ onNavigate }: EmployerSidebarProps) {
  const { t } = useTranslation("employerNavigation")

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-border bg-background-card shadow-lg">
      <NavLink
        to={ROUTES.employer.root}
        onClick={onNavigate}
        className="flex h-24 items-center justify-center border-b border-border p-4"
      >
        <Logo size="md" alt={t("logoAlt")} />
      </NavLink>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <section key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              {t(section.label)}
            </p>
            <nav className="space-y-1">
              {section.items.map(({ label, path, icon: Icon, end }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-primary text-white shadow-md"
                        : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{t(label)}</span>
                </NavLink>
              ))}
            </nav>
          </section>
        ))}
      </div>
    </aside>
  )
}
