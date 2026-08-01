import {
  Building2,
  Check,
  Ban,
  Eye,
  Globe2,
  ListChecks,
  MapPin,
  MoreHorizontal,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/config"
import { StatusBadge } from "@/components/shared/badges"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { ApproveModal, RejectModal, SuspendModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { images } from "@/constants/images"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"

import type { AdminCompanyRecord } from "../types/adminCompanies.types"

type CompanyAction = "approve" | "reject" | "suspend"

interface CompanyActionsDropdownProps {
  company: AdminCompanyRecord
  disabled: boolean
  fullWidth?: boolean
  onViewDetails: (company: AdminCompanyRecord) => void
  onSelect: (company: AdminCompanyRecord, action: CompanyAction) => void
}

function CompanyActionsDropdown({
  company,
  disabled,
  fullWidth = false,
  onViewDetails,
  onSelect,
}: CompanyActionsDropdownProps) {
  const { t } = useTranslation("adminCompanies")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={fullWidth ? "sm" : "icon"}
          variant="ghost"
          disabled={disabled}
          className={fullWidth ? "w-full" : "h-8 w-8"}
          aria-label={t("actions.reviewAria", { name: company.name })}
        >
          {fullWidth && <span>{t("actions.reviewCompany")}</span>}
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("actions.approvalActions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onSelect={() => onViewDetails(company)}>
          <Eye className="h-4 w-4" />
          {t("actions.viewDetails")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-primary focus:bg-primary/10 focus:text-primary"
          onSelect={() => onSelect(company, "approve")}
        >
          <Check className="h-4 w-4" />
          {t("actions.approve")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
          onSelect={() => onSelect(company, "suspend")}
        >
          <Ban className="h-4 w-4" />
          {t("actions.suspend")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
          onSelect={() => onSelect(company, "reject")}
        >
          <X className="h-4 w-4" />
          {t("actions.reject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AdminCompanyMobileCardProps {
  company: AdminCompanyRecord
  isUpdating: boolean
  onViewDetails: (company: AdminCompanyRecord) => void
  onAction: (company: AdminCompanyRecord, action: CompanyAction) => void
}
const AdminCompanyMobileCard = ({
  company,
  isUpdating,
  onViewDetails,
  onAction,
}: AdminCompanyMobileCardProps) => {
  const { t } = useTranslation("adminCompanies")
  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{company.name}</h3>
          <p className="truncate text-xs text-text-muted">
            {company.industry || t("fallbacks.industryMissing")}
          </p>
        </div>
        <StatusBadge
          status={company.approval_status ?? company.status ?? "pending"}
          variant="soft"
        />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {company.location || t("fallbacks.locationMissing")}
        </p>
        <p className="flex items-center gap-2">
          <UserRound className="h-3.5 w-3.5 text-primary" />
          {company.employer?.name || company.employer?.email || t("fallbacks.employerMissing")}
        </p>
        {company.website && (
          <p className="flex items-center gap-2 truncate">
            <Globe2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            {company.website}
          </p>
        )}
      </div>

      <div className="mt-4">
        <CompanyActionsDropdown
          company={company}
          disabled={isUpdating}
          fullWidth
          onViewDetails={onViewDetails}
          onSelect={onAction}
        />
      </div>
    </article>
  )
}

interface AdminCompaniesTableProps {
  companies: AdminCompanyRecord[]
  isLoading: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
  onApprove: (id: string | number) => void | Promise<unknown>
  onReject: (id: string | number, reason?: string) => void | Promise<unknown>
  onSuspend: (id: string | number) => void | Promise<unknown>
}

export default function AdminCompaniesTable({
  companies,
  isLoading,
  isUpdating,
  pagination,
  onPageChange,
  onApprove,
  onReject,
  onSuspend,
}: AdminCompaniesTableProps) {
  const { t } = useTranslation("adminCompanies")
  const navigate = useNavigate()
  const [selectedCompany, setSelectedCompany] = useState<AdminCompanyRecord | null>(null)
  const [selectedAction, setSelectedAction] = useState<CompanyAction | null>(null)

  const viewDetails = (company: AdminCompanyRecord) => {
    navigate(ROUTES.admin.companyDetails(company.id))
  }

  const selectAction = (company: AdminCompanyRecord, action: CompanyAction) => {
    setSelectedCompany(company)
    setSelectedAction(action)
  }

  const closeActionModal = () => {
    if (isUpdating) return
    setSelectedAction(null)
    setSelectedCompany(null)
  }

  const confirmApprove = async () => {
    if (!selectedCompany) return
    await onApprove(selectedCompany.id)
    setSelectedAction(null)
    setSelectedCompany(null)
  }

  const confirmReject = async (reason: string) => {
    if (!selectedCompany) return
    await onReject(selectedCompany.id, reason)
    setSelectedAction(null)
    setSelectedCompany(null)
  }

  const confirmSuspend = async () => {
    if (!selectedCompany) return
    await onSuspend(selectedCompany.id)
    setSelectedAction(null)
    setSelectedCompany(null)
  }

  const columns: Column<AdminCompanyRecord>[] = [
    {
      key: "company",
      header: t("table.company"),
      headerIcon: Building2,
      cell: (company) => (
        <div>
          <p className="font-semibold text-text-primary">{company.name}</p>
          <p className="text-xs text-text-muted">
            {company.website || company.industry || t("table.noDetails")}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      header: t("table.location"),
      headerIcon: MapPin,
      cell: (company) => company.location || "—",
    },
    {
      key: "employer",
      header: t("table.employer"),
      headerIcon: UserRound,
      cell: (company) => company.employer?.name || company.employer?.email || "—",
    },
    {
      key: "status",
      header: t("table.status"),
      headerIcon: ShieldCheck,
      cell: (company) => (
        <StatusBadge
          status={company.approval_status ?? company.status ?? "pending"}
          variant="soft"
        />
      ),
    },
    {
      key: "actions",
      header: t("table.review"),
      headerIcon: ListChecks,
      className: "text-right",
      cell: (company) => (
        <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
          <CompanyActionsDropdown
            company={company}
            disabled={isUpdating}
            onViewDetails={viewDetails}
            onSelect={selectAction}
          />
        </div>
      ),
    },
  ]

  const MobileCompanyCard = ({ item }: { item: AdminCompanyRecord }) => (
    <AdminCompanyMobileCard
      company={item}
      isUpdating={isUpdating}
      onViewDetails={viewDetails}
      onAction={selectAction}
    />
  )

  return (
    <>
      <DataTable
        data={companies}
        columns={columns}
        getRowId={(company) => company.id}
        loading={isLoading}
        pagination={{
          total: pagination?.total ?? companies.length,
          page: pagination?.currentPage ?? 1,
          lastPage: pagination?.lastPage ?? 1,
          perPage: pagination?.perPage,
        }}
        onPageChange={onPageChange}
        onRowClick={viewDetails}
        mobileCardComponent={MobileCompanyCard}
        emptyMessage={t("table.emptyTitle")}
        emptyDescription={t("table.emptyDescription")}
        emptyImage={images.companies}
        emptyImageAlt={t("table.emptyImageAlt")}
        className="rounded-2xl bg-background-card shadow-card"
      />

      <ApproveModal
        open={selectedAction === "approve"}
        name={selectedCompany?.name ?? t("fallbacks.company")}
        loading={isUpdating}
        onClose={closeActionModal}
        onConfirm={confirmApprove}
        title={t("modals.approveTitle")}
        description={t("modals.approveDescription", {
          name: selectedCompany?.name ?? t("fallbacks.company"),
        })}
        confirmText={t("modals.approveConfirm")}
      />

      <RejectModal
        open={selectedAction === "reject"}
        name={selectedCompany?.name ?? t("fallbacks.company")}
        loading={isUpdating}
        onClose={closeActionModal}
        onConfirm={confirmReject}
        title={t("modals.rejectTitle")}
        description={t("modals.rejectDescription", {
          name: selectedCompany?.name ?? t("fallbacks.company"),
        })}
        confirmText={t("modals.rejectConfirm")}
      />

      <SuspendModal
        open={selectedAction === "suspend"}
        name={selectedCompany?.name ?? t("fallbacks.company")}
        loading={isUpdating}
        onClose={closeActionModal}
        onConfirm={confirmSuspend}
      />
    </>
  )
}
