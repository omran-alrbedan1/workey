import { Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminCompaniesTable from "../components/AdminCompaniesTable"
import AdminCompaniesFilter from "../components/AdminCompaniesFilter"
import { useAdminCompanies } from "../hooks/useAdminCompanies"
import { images } from "@/constants/images"

export default function AdminCompaniesPage() {
  const { t } = useTranslation("adminCompanies")
  const companies = useAdminCompanies()
  if (companies.isError)
    return (
      <>
        <PageHeader
          title={t("page.title")}
          description={t("page.description")}
          icon={Building2}
          image={{
            src: images.companies,
            alt: t("page.imageAlt"),
          }}
        />
        <div className="mt-4">
          <AdminFeatureError
            title={t("errors.listTitle")}
            error={companies.error}
            retry={() => {
              void companies.refetch()
            }}
          />
        </div>
      </>
    )
  const updating =
    companies.approveMutation.isPending ||
    companies.rejectMutation.isPending ||
    companies.suspendMutation.isPending
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.title")}
        description={t("page.description")}
        icon={Building2}
        count={companies.data?.pagination.total}
        image={{
          src: images.companies,
          alt: t("page.imageAlt"),
        }}
      />
      <AdminCompaniesFilter
        onApplyFilters={companies.applyFilters}
        onResetFilters={companies.resetFilters}
        isLoading={companies.isFetching}
        initialFilters={companies.filtersForForm}
        industries={companies.industries}
      />
      <AdminCompaniesTable
        companies={companies?.companies}
        isLoading={companies.isPending}
        isUpdating={updating}
        pagination={companies.data?.pagination}
        onPageChange={companies.setPage}
        onApprove={(id) => companies.approveMutation.mutateAsync(id)}
        onReject={(id, reason) =>
          companies.rejectMutation.mutateAsync({ id, reason: reason ?? "" })
        }
        onSuspend={(id) => companies.suspendMutation.mutateAsync(id)}
      />
    </div>
  )
}
