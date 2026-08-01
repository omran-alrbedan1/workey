import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
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

export default function AdminTestsTable({
  tests,
  isLoading,
  isDeleting,
  isUpdating,
  pagination,
  onDelete,
  onUpdate,
}: {
  tests: AdminTestRecord[]
  isLoading: boolean
  isDeleting: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onDelete: (id: string | number) => Promise<unknown>
  onUpdate: (input: AdminTestUpdateInput) => Promise<unknown>
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
      cell: (test) => t("minutes", { count: test.duration_minutes }),
    },
    {
      key: "score",
      header: t("columns.passing"),
      cell: (test) => `${test.passing_score} / ${test.max_score}`,
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (test) => (
        <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />
      ),
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-right",
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
        onPageChange={() => {}}
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
