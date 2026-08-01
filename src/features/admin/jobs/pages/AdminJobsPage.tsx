import { BriefcaseBusiness } from "lucide-react"
import { useState } from "react"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminJobsFilter from "../components/AdminJobsFilter"
import AdminJobsTable from "../components/AdminJobsTable"
import { useAdminJobs } from "../hooks/useAdminJobs"
import { images } from "@/constants/images"
import { useTranslation } from "react-i18next"
import {
  ADMIN_JOB_FILTER_DEFAULTS,
  type AdminJobFilterForm,
} from "../types/adminJobs.types"

export default function AdminJobsPage() {
  const { t } = useTranslation("adminJobs")
  const [filters, setFilters] = useState<AdminJobFilterForm>(ADMIN_JOB_FILTER_DEFAULTS)
  const jobs = useAdminJobs(filters)
  if (jobs.isError)
    return (
  <>
  <PageHeader
    title={t("title")}
    description={t("description")}
    icon={BriefcaseBusiness}
    image={{
      src:images.jobs,
      alt:'jobs'
    }}
    count={jobs.data?.pagination.total}
  />
  <div className="mt-4">
      <AdminFeatureError
        title={t("title")}
        error={jobs.error}
        retry={() => {
          void jobs.refetch()
        }}
        />
        </div>
        </>
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={BriefcaseBusiness}
        image={{
          src:images.jobs,
          alt:'jobs'
        }}
        count={jobs.data?.pagination.total}
      />
      <AdminJobsFilter
        initialFilters={filters}
        isLoading={jobs.isFetching}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(ADMIN_JOB_FILTER_DEFAULTS)}
      />
      <AdminJobsTable
        jobs={jobs.data?.items ?? []}
        isLoading={jobs.isPending}
        pagination={jobs.data?.pagination}
        onPageChange={jobs.setPage}
      />
    </div>
  )
}
