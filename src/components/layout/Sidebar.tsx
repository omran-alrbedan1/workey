import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ClipboardList,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ScrollText,
  UserRoundCheck,
  Users,
  Wrench,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { NavLink, useLocation, useNavigate } from "react-router-dom"

import { images } from "@/constants/images"
import { ROUTES } from "@/config"

interface SidebarProps {
  isOpen?: boolean
  isMobile?: boolean
  onClose?: () => void
}

interface NavigationItem {
  label: string
  path?: string
  icon: LucideIcon
  badge?: number
  children?: NavigationItem[]
}

const navigation: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: "sections.overview",
    items: [{ label: "items.dashboard", path: ROUTES.admin.root, icon: LayoutDashboard }],
  },
  {
    label: "sections.people",
    items: [
      { label: "items.allUsers", path: ROUTES.admin.users, icon: Users },
      { label: "items.candidates", path: ROUTES.admin.candidates, icon: UserRoundCheck },
      { label: "items.employers", path: ROUTES.admin.employers, icon: BriefcaseBusiness },
      { label: "items.companies", path: ROUTES.admin.companies, icon: Building2 },
    ],
  },
  {
    label: "sections.recruitment",
    items: [
      { label: "items.jobs", path: ROUTES.admin.jobs, icon: BriefcaseBusiness },
      { label: "items.applications", path: ROUTES.admin.applications, icon: ClipboardList },
    ],
  },
  {
    label: "sections.platform",
    items: [
      { label: "items.skills", path: ROUTES.admin.skills, icon: Wrench },
      { label: "items.assessmentTests", path: ROUTES.admin.tests, icon: FlaskConical },
      { label: "items.notifications", path: ROUTES.admin.notifications, icon: Bell },
      { label: "items.reports", path: ROUTES.admin.reports.root, icon: BarChart3 },
      { label: "items.auditLogs", path: ROUTES.admin.auditLogs, icon: ScrollText },
    ],
  },
]

function NavigationLink({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const { t } = useTranslation("adminNavigation")
  if (!item.path) return null
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      end={item.path === ROUTES.admin.root}
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
      <span className="flex-1">{t(item.label)}</span>
      {item.badge ? (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      ) : null}
    </NavLink>
  )
}

function NavigationGroup({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const { t } = useTranslation("adminNavigation")
  const location = useLocation()
  const isChildActive =
    item.children?.some((child) => child.path && location.pathname.startsWith(child.path)) ?? false
  const [open, setOpen] = useState(isChildActive)
  const Icon = item.icon

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-text-secondary transition hover:bg-background-secondary hover:text-text-primary"
      >
        <Icon className="h-[18px] w-[18px]" />
        <span className="flex-1 text-start">{t(item.label)}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-0" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
          {item.children?.map((child) => (
            <NavigationLink key={child.path} item={child} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ isMobile, onClose }: { isMobile: boolean; onClose?: () => void }) {
  const { t } = useTranslation("adminNavigation")
  const navigate = useNavigate()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-background-card shadow-lg">
      <div className="relative border-b border-border p-4">
        {isMobile && (
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={onClose}
            className="absolute top-3 rounded-lg p-2 text-text-secondary hover:bg-background-secondary ltr:right-3 rtl:left-3"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            navigate(ROUTES.admin.root)
            onClose?.()
          }}
          className="mx-auto flex h-16 items-center justify-center"
        >
          <img src={images.logo} alt={t("logoAlt")} className="h-14 w-auto" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navigation.map((section) => (
          <section key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              {t(section.label)}
            </p>
            <div className="space-y-1">
              {section.items.map((item) =>
                item.children ? (
                  <NavigationGroup key={item.label} item={item} onNavigate={onClose} />
                ) : (
                  <NavigationLink key={item.path} item={item} onNavigate={onClose} />
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="space-y-1 border-t border-border p-3">
        <NavigationLink
          item={{ label: "items.settings", path: ROUTES.admin.settings, icon: Settings }}
          onNavigate={onClose}
        />
        <NavigationLink
          item={{ label: "items.helpSupport", path: ROUTES.admin.help, icon: HelpCircle }}
          onNavigate={onClose}
        />
      </div>
    </aside>
  )
}

export default function Sidebar({ isOpen = true, isMobile = false, onClose }: SidebarProps) {
  const { t } = useTranslation("adminNavigation")
  useEffect(() => {
    if (!isMobile || !isOpen) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isOpen])

  if (!isMobile) return <SidebarContent isMobile={false} />

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label={t("closeMenu")}
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`relative h-full w-64 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent isMobile onClose={onClose} />
      </div>
    </div>
  )
}
