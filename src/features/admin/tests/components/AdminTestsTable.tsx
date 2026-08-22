import { Edit, MoreHorizontal, Trash2, FileText, Clock, Target, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/badges"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteModal } from "@/components/shared/modals"
import EditTestDialog from "./EditTestDialog"
import { images } from "@/constants/images"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminTestRecord, AdminTestUpdateInput } from "../types/adminTests.types"

interface AdminTestMobileCardProps {
  test: AdminTestRecord
  isDeleting: boolean
  isUpdating: boolean
  onEdit: (test: AdminTestRecord) => void
  onDelete: (test: AdminTestRecord) => void
}

const AdminTestMobileCard = ({
  test,
  isDeleting,
  isUpdating,
  onEdit,
  onDelete,
}: AdminTestMobileCardProps) => {
  const { t } = useTranslation("adminTests")
  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{test.title}</h3>
          <p className="truncate text-xs text-text-muted">
            {test.description || t("noDescription")}
          </p>
        </div>
        <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {t("minutes", { count: test.duration_minutes })}
        </p>
        <p className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-primary" />
          {t("columns.passing")}: {test.passing_score} / {test.max_score}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isDeleting || isUpdating}
          onClick={() => onEdit(test)}
        >
          <Edit className="h-4 w-4" />
          {t("edit.action")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          disabled={isDeleting || isUpdating}
          onClick={() => onDelete(test)}
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </div>
    </article>
  )
}

export default function AdminTestsTable({
  tests,
  isLoading,
  isDeleting,
  isUpdating,
  pagination,
  onDelete,
  onUpdate,
  onPageChange,
}: {
  tests: AdminTestRecord[]
  isLoading: boolean
  isDeleting: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onDelete: (id: string | number) => Promise<unknown>
  onUpdate: (input: AdminTestUpdateInput) => Promise<unknown>
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation("adminTests")
  const [testToDelete, setTestToDelete] = useState<AdminTestRecord | null>(null)
  const [testToEdit, setTestToEdit] = useState<AdminTestRecord | null>(null)

  const confirmDelete = async () => {
    if (!testToDelete) return
    await onDelete(testToDelete.id)
    setTestToDelete(null)
  }

  const columns: Column<AdminTestRecord>[] = [
    {
      key: "title",
      header: t("columns.assessment"),
      headerIcon: FileText,
      cell: (test) => (
        <div>
          <p className="font-semibold text-text-primary">{test.title}</p>
          <p className="max-w-sm truncate text-xs text-text-muted">
            {test.description || t("noDescription")}
          </p>
        </div>
      ),
    },
    {
      key: "duration",
      header: t("columns.duration"),
      headerIcon: Clock,
      cell: (test) => t("minutes", { count: test.duration_minutes }),
    },
    {
      key: "score",
      header: t("columns.passing"),
      headerIcon: Target,
      cell: (test) => `${test.passing_score} / ${test.max_score}`,
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: ShieldCheck,
      cell: (test) => (
        <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />
      ),
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-end",
      cell: (test) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={isDeleting || isUpdating}
                className="h-8 w-8"
                aria-label={t("actionsFor", { name: test.title })}
                title={t("actionsFor", { name: test.title })}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onSelect={() => setTestToEdit(test)}>
                <Edit className="h-4 w-4" />
                {t("edit.action")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
                onSelect={() => setTestToDelete(test)}
              >
                <Trash2 className="h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const MobileTestCard = ({ item }: { item: AdminTestRecord }) => (
    <AdminTestMobileCard
      test={item}
      isDeleting={isDeleting}
      isUpdating={isUpdating}
      onEdit={setTestToEdit}
      onDelete={setTestToDelete}
    />
  )

  return (
    <>
      <DataTable
        data={tests}
        columns={columns}
        getRowId={(test) => test.id}
        loading={isLoading}
        pagination={{
          total: pagination?.total ?? tests.length,
          page: pagination?.currentPage ?? 1,
          lastPage: pagination?.lastPage ?? 1,
          perPage: pagination?.perPage,
        }}
        onPageChange={onPageChange}
        mobileCardComponent={MobileTestCard}
        emptyMessage={t("empty")}
        emptyDescription={t("emptyDescription")}
        emptyImage={images.emptyProducts}
        emptyImageAlt={t("empty")}
        className="rounded-2xl bg-background-card shadow-card"
      />
      <EditTestDialog
        test={testToEdit}
        isUpdating={isUpdating}
        onClose={() => {
          if (!isUpdating) setTestToEdit(null)
        }}
        onUpdate={onUpdate}
      />
      <DeleteModal
        open={testToDelete !== null}
        name={testToDelete?.title ?? ""}
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) setTestToDelete(null)
        }}
        onConfirm={() => {
          void confirmDelete()
        }}
      />
    </>
  )
}
