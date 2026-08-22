import { BriefcaseBusiness, Plus } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import EmployerJobsFilter from "../components/EmployerJobsFilter"
import EmployerJobsTable from "../components/EmployerJobsTable"
import { useEmployerJobs } from "../hooks/useEmployerJobs"
import {
  EMPLOYER_JOB_FILTER_DEFAULTS,
  type EmployerJobFilterForm,
} from "../types/employerJobs.types"

export default function EmployerJobsPage() {
  const { t } = useTranslation("employerJobs")
  const [filters, setFilters] = useState<EmployerJobFilterForm>(EMPLOYER_JOB_FILTER_DEFAULTS)
  const jobs = useEmployerJobs(filters)

  if (jobs.isError) {
    return (
      <EmployerFeatureError
        title={t("title")}
        error={jobs.error}
        retry={() => void jobs.refetch()}
      />
    )
  }

  const isUpdating =
    jobs.publishMutation.isPending || jobs.closeMutation.isPending || jobs.deleteMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={BriefcaseBusiness}
        count={jobs.data?.pagination.total}
        rightContent={
          <Button asChild className="text-white">
            <Link to={ROUTES.employer.createJob}>
              <Plus /> {t("actions.new")}
            </Link>
          </Button>
        }
      />
      <EmployerJobsFilter
        initialFilters={filters}
        isLoading={jobs.isFetching}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(EMPLOYER_JOB_FILTER_DEFAULTS)}
      />
      <EmployerJobsTable
        collection={jobs.data}
        isLoading={jobs.isPending}
        isUpdating={isUpdating}
        onPageChange={jobs.setPage}
        onPublish={jobs.publishMutation.mutateAsync}
        onClose={jobs.closeMutation.mutateAsync}
        onDelete={jobs.deleteMutation.mutateAsync}
      />
    </div>
  )
}
