import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardList,
  FileQuestion,
  Plus,
  RefreshCw,
  UserRound,
  UsersRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import { valueOf } from "@/lib/keyValue"
import { candidateDisplayName } from "@/features/employer/applicants/utils/candidateDisplay"
import { useEmployerDashboard } from "../hooks/useEmployerDashboard"

const quickActions = [
  {
    key: "jobs",
    route: ROUTES.employer.jobs,
    icon: BriefcaseBusiness,
    tone: "text-primary bg-primary/10",
  },
  {
    key: "applicants",
    route: ROUTES.employer.applicants,
    icon: UsersRound,
    tone: "text-secondary bg-secondary/10",
  },
  {
    key: "company",
    route: ROUTES.employer.company,
    icon: Building2,
    tone: "text-emerald-600 bg-emerald-500/10",
  },
  {
    key: "profile",
    route: ROUTES.employer.profile,
    icon: UserRound,
    tone: "text-amber-600 bg-amber-500/10",
  },
] as const

export default function EmployerDashboard() {
  const { t } = useTranslation("employerDashboard")
  const dashboard = useEmployerDashboard()

  const metrics = dashboard.data
    ? [
        {
          key: "openJobs",
          value: dashboard.data.stats.openJobs,
          icon: BriefcaseBusiness,
          tone: "text-primary bg-primary/10",
        },
        {
          key: "activeApplicants",
          value: dashboard.data.stats.activeApplicants,
          icon: ClipboardList,
          tone: "text-emerald-600 bg-emerald-500/10",
        },
        {
          key: "upcomingInterviews",
          value: dashboard.data.stats.upcomingInterviews,
          icon: CalendarClock,
          tone: "text-secondary bg-secondary/10",
        },
        {
          key: "pendingTests",
          value: dashboard.data.stats.pendingTests,
          icon: FileQuestion,
          tone: "text-sky-600 bg-sky-500/10",
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={BriefcaseBusiness}
        rightContent={
          <Link
            to={ROUTES.employer.createJob}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white shadow hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t("createJob")}
          </Link>
        }
      />

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold text-text-primary">{t("stats.title")}</h2>
            <p className="text-sm text-text-muted">{t("stats.description")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={dashboard.isFetching}
            onClick={() => void dashboard.refetch()}
          >
            <RefreshCw className={`h-4 w-4 ${dashboard.isFetching ? "animate-spin" : ""}`} />
            {t("stats.refresh")}
          </Button>
        </div>

        {dashboard.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : dashboard.isError ? (
          <ErrorState
            variant="network"
            size="sm"
            retry={() => void dashboard.refetch()}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ key, value, icon: Icon, tone }) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-background-card p-5 shadow-card"
              >
                <div className={`mb-4 w-fit rounded-lg p-2.5 ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold text-text-primary">{value.toLocaleString()}</p>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {t(`stats.${key}.label`)}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {t(`stats.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-3 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-border bg-background-card p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-text-primary">{t("recentApplications.title")}</h2>
              <p className="text-sm text-text-muted">{t("recentApplications.description")}</p>
            </div>
            <Link
              to={ROUTES.employer.applicants}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("recentApplications.viewAll")}
              <ArrowUpRight className="h-4 w-4 rtl:-rotate-90" />
            </Link>
          </div>

          {dashboard.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          ) : dashboard.data?.recentApplications.length ? (
            <div className="divide-y divide-border">
              {dashboard.data.recentApplications.map(({ application, job }) => (
                <Link
                  key={application.id}
                  to={ROUTES.employer.applicantDetails(application.id)}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:text-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {candidateDisplayName(application, t("recentApplications.unknownCandidate"))}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t("recentApplications.meta", {
                        job: job.title,
                        status: valueOf(application.status, t("recentApplications.unknownStatus")),
                      })}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted rtl:-rotate-90" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("recentApplications.empty")}
              description={t("recentApplications.emptyDescription")}
              icon={UsersRound}
              className="py-8 bg-transparent"
            />
          )}
        </section>

        <section className="rounded-lg border border-border bg-background-card p-5 shadow-card">
          <div className="mb-4">
            <h2 className="font-semibold text-text-primary">{t("funnel.title")}</h2>
            <p className="text-sm text-text-muted">{t("funnel.description")}</p>
          </div>

          {dashboard.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-9 rounded-lg" />
              ))}
            </div>
          ) : dashboard.data?.funnel.some((item) => item.value > 0) ? (
            <div className="space-y-3">
              {dashboard.data.funnel.map((item) => {
                const maxValue = Math.max(...dashboard.data.funnel.map((entry) => entry.value), 1)
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-text-primary">{item.label}</span>
                      <span className="text-text-muted">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-background-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: item.value > 0 ? `${Math.max(6, (item.value / maxValue) * 100)}%` : 0,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title={t("funnel.empty")}
              description={t("funnel.emptyDescription")}
              icon={ClipboardList}
              className="py-8 bg-transparent"
            />
          )}
        </section>
      </div>

      <section className="rounded-lg border border-border bg-background-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-text-primary">{t("recentJobs.title")}</h2>
            <p className="text-sm text-text-muted">{t("recentJobs.description")}</p>
          </div>
          <Link
            to={ROUTES.employer.jobs}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("recentJobs.viewAll")}
            <ArrowUpRight className="h-4 w-4 rtl:-rotate-90" />
          </Link>
        </div>

        {dashboard.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        ) : dashboard.data?.recentJobs.length ? (
          <div className="divide-y divide-border">
            {dashboard.data.recentJobs.map((job) => (
              <Link
                key={job.id}
                to={ROUTES.employer.jobDetails(job.id)}
                className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:text-primary"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{job.title}</p>
                  <p className="text-xs text-text-muted">
                    {t("recentJobs.meta", {
                      applications: job.applications_count ?? 0,
                      status: valueOf(job.status, t("recentJobs.unknownStatus")),
                    })}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted rtl:-rotate-90" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("recentJobs.empty")}
            description={t("recentJobs.emptyDescription", "No jobs posted yet.")}
            icon={BriefcaseBusiness}
            className="py-8 bg-transparent"
          />
        )}
      </section>

      <section>
        <div className="mb-3">
          <h2 className="font-semibold text-text-primary">{t("quickActions.title")}</h2>
          <p className="text-sm text-text-muted">{t("quickActions.description")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ key, route, icon: Icon, tone }) => (
            <Link
              key={key}
              to={route}
              className="group flex min-h-36 flex-col justify-between rounded-lg border border-border bg-background-card p-5 shadow-card transition hover:border-primary/40 hover:shadow-soft"
            >
              <div className={`w-fit rounded-lg p-2.5 ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t(`quickActions.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {t(`quickActions.${key}.description`)}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition group-hover:text-primary rtl:-rotate-90" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
