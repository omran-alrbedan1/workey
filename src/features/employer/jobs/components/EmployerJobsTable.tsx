import { useState } from "react"
import { Eye, MoreHorizontal, Pencil, Send, Square, Trash2, UsersRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import { CloseModal, DeleteModal, PublishModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/config"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerJob } from "../types/employerJobs.types"

function getKey(v: unknown): string {
  return keyOf(v)
}

function getValue(v: unknown): string {
  return valueOf(v)
}

export default function EmployerJobsTable({
  collection,
  isLoading,
  isUpdating,
  onPageChange,
  onPublish,
  onClose,
  onDelete,
}: {
  collection?: EmployerCollection<EmployerJob>
  isLoading: boolean
  isUpdating: boolean
  onPageChange: (page: number) => void
  onPublish: (id: string | number) => Promise<unknown>
  onClose: (id: string | number) => Promise<unknown>
  onDelete: (id: string | number) => Promise<unknown>
}) {
  const { t, i18n } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const [jobToDelete, setJobToDelete] = useState<EmployerJob | null>(null)
  const [jobToPublish, setJobToPublish] = useState<EmployerJob | null>(null)
  const [jobToClose, setJobToClose] = useState<EmployerJob | null>(null)
  const jobs = collection?.items ?? []

  const confirmPublish = async () => {
    if (!jobToPublish) return
    try {
      await onPublish(jobToPublish.id)
      setJobToPublish(null)
    } catch {
      // The mutation hook already shows the error toast.
    }
  }

  const confirmClose = async () => {
    if (!jobToClose) return
    try {
      await onClose(jobToClose.id)
      setJobToClose(null)
    } catch {
      // The mutation hook already shows the error toast.
    }
  }

  const confirmDelete = async () => {
    if (!jobToDelete) return
    try {
      await onDelete(jobToDelete.id)
      setJobToDelete(null)
    } catch {
      // The mutation hook already shows the error toast.
    }
  }

  const columns: Column<EmployerJob>[] = [
    {
      key: "title",
      header: t("columns.job"),
      cell: (job) => (
        <div>
          <p className="font-semibold text-text-primary">{job.title}</p>
          <p className="text-xs text-text-muted">{job.location || "-"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (job) => <StatusBadge status={job.status ?? "draft"} variant="soft" />,
    },
    { key: "type", header: t("columns.type"), cell: (job) => getValue(job.employment_type) },
    { key: "applications", header: t("columns.applications"), cell: (job) => job.applications_count ?? 0 },
    {
      key: "created",
      header: t("columns.created"),
      cell: (job) => job.created_at ? new Date(job.created_at).toLocaleDateString(i18n.language) : "-",
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-right",
      cell: (job) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isUpdating} aria-label={t("actions.menuFor", { title: job.title })}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.jobDetails(job.id))}>
                <Eye /> {t("actions.view")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.editJob(job.id))}>
                <Pencil /> {t("actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.jobApplicants(job.id))}>
                <UsersRound /> {t("actions.applicants")}
              </DropdownMenuItem>
              {(getKey(job.status) || "draft") === "draft" && (
                <DropdownMenuItem onSelect={() => setJobToPublish(job)}>
                  <Send /> {t("actions.publish")}
                </DropdownMenuItem>
              )}
              {getKey(job.status) !== "closed" && getKey(job.status) !== "draft" && (
                <DropdownMenuItem onSelect={() => setJobToClose(job)}>
                  <Square /> {t("actions.close")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700"
                onSelect={() => setJobToDelete(job)}
              >
                <Trash2 /> {t("actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={jobs}
        columns={columns}
        getRowId={(job) => job.id}
        loading={isLoading}
        pagination={{
          total: collection?.pagination.total ?? 0,
          page: collection?.pagination.currentPage ?? 1,
          lastPage: collection?.pagination.lastPage ?? 1,
          perPage: collection?.pagination.perPage,
        }}
        onPageChange={onPageChange}
        emptyMessage={t("empty.title")}
        emptyDescription={t("empty.description")}
        className="bg-background-card shadow-card"
      />
      <PublishModal
        open={jobToPublish !== null}
        loading={isUpdating}
        title={t("publishModal.title")}
        description={t("publishModal.description", { name: jobToPublish?.title ?? "" })}
        hint={t("publishModal.hint")}
        confirmText={t("publishModal.confirm")}
        cancelText={t("publishModal.cancel")}
        loadingText={t("publishModal.processing")}
        onClose={() => {
          if (!isUpdating) setJobToPublish(null)
        }}
        onConfirm={confirmPublish}
      />
      <CloseModal
        open={jobToClose !== null}
        loading={isUpdating}
        title={t("closeModal.title")}
        description={t("closeModal.description", { name: jobToClose?.title ?? "" })}
        hint={t("closeModal.hint")}
        confirmText={t("closeModal.confirm")}
        cancelText={t("closeModal.cancel")}
        loadingText={t("closeModal.processing")}
        onClose={() => {
          if (!isUpdating) setJobToClose(null)
        }}
        onConfirm={confirmClose}
      />
      <DeleteModal
        open={jobToDelete !== null}
        name={jobToDelete?.title ?? ""}
        loading={isUpdating}
        onClose={() => {
          if (!isUpdating) setJobToDelete(null)
        }}
        onConfirm={confirmDelete}
      />
    </>
  )
}
