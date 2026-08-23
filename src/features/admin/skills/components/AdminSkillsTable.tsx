import { zodResolver } from "@hookform/resolvers/zod"
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Badge,
  Hash,
  Calendar,
  Image as ImageIcon,
  Upload,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { DeleteModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { images } from "@/constants/images"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminSkillInput, AdminSkillRecord } from "../types/adminSkills.types"
import { adminSkillSchema, type AdminSkillFormValues } from "../validation/adminSkills.validation"
import SkillIconUpload from "./SkillIconUpload"

function EditSkillDialog({
  skill,
  isUpdating,
  onClose,
  onUpdate,
}: {
  skill: AdminSkillRecord | null
  isUpdating: boolean
  onClose: () => void
  onUpdate: (input: AdminSkillInput & { id: string | number }) => Promise<unknown>
}) {
  const { t } = useTranslation("adminSkills")
  const form = useForm<AdminSkillFormValues>({
    resolver: zodResolver(adminSkillSchema),
    defaultValues: { name: "", slug: "" },
  })

  useEffect(() => {
    if (!skill) return
    form.reset({ name: skill.name, slug: skill.slug })
  }, [form, skill])

  const submit = async (values: AdminSkillFormValues) => {
    if (!skill) return
    try {
      await onUpdate({ id: skill.id, ...values })
      onClose()
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }

  return (
    <Dialog open={skill !== null} onOpenChange={(open) => !open && !isUpdating && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit.title")}</DialogTitle>
          <DialogDescription>{t("edit.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.slug")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.slugPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isUpdating} onClick={onClose}>
                {t("edit.cancel")}
              </Button>
              <Button type="submit" className="text-white" disabled={isUpdating}>
                {t("edit.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface AdminSkillMobileCardProps {
  skill: AdminSkillRecord
  isDeleting: boolean
  isUpdating: boolean
  onEdit: (skill: AdminSkillRecord) => void
  onUploadIcon: (skill: AdminSkillRecord) => void
  onDelete: (skill: AdminSkillRecord) => void
}

const AdminSkillMobileCard = ({
  skill,
  isDeleting,
  isUpdating,
  onEdit,
  onUploadIcon,
  onDelete,
}: AdminSkillMobileCardProps) => {
  const { t } = useTranslation("adminSkills")
  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        {skill.icon ? (
          <img
            src={skill.icon}
            alt={`${skill.name} icon`}
            className="h-10 w-10 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Badge className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{skill.name}</h3>
          <p className="truncate text-xs text-text-muted">
            <code className="rounded bg-background-secondary px-1.5 py-0.5">{skill.slug}</code>
          </p>
        </div>
      </div>

      {skill.created_at && (
        <div className="mt-3 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
          <p className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {new Date(skill.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isDeleting || isUpdating}
          onClick={() => onEdit(skill)}
        >
          <Edit className="h-4 w-4" />
          {t("edit.action")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isDeleting || isUpdating}
          onClick={() => onUploadIcon(skill)}
        >
          <Upload className="h-4 w-4" />
          {t("uploadIcon")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          disabled={isDeleting || isUpdating}
          onClick={() => onDelete(skill)}
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </div>
    </article>
  )
}

export default function AdminSkillsTable({
  skills,
  isLoading,
  isDeleting,
  isUpdating,
  pagination,
  onDelete,
  onUpdate,
  onRefetch,
  onPageChange,
}: {
  skills: AdminSkillRecord[]
  isLoading: boolean
  isDeleting: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onDelete: (id: string | number) => Promise<unknown>
  onUpdate: (input: AdminSkillInput & { id: string | number }) => Promise<unknown>
  onRefetch: () => void
  onPageChange: (page: number) => void
}) {
  const { t, i18n } = useTranslation("adminSkills")
  const [skillToDelete, setSkillToDelete] = useState<AdminSkillRecord | null>(null)
  const [skillToEdit, setSkillToEdit] = useState<AdminSkillRecord | null>(null)
  const [skillToUploadIcon, setSkillToUploadIcon] = useState<AdminSkillRecord | null>(null)

  const confirmDelete = async () => {
    if (!skillToDelete) return
    await onDelete(skillToDelete.id)
    setSkillToDelete(null)
  }

  const columns: Column<AdminSkillRecord>[] = [
    {
      key: "icon",
      header: t("columns.icon"),
      headerIcon: ImageIcon,
      cell: (skill) =>
        skill.icon ? (
          <img
            src={skill.icon}
            alt={`${skill.name} icon`}
            className="h-8 w-8 rounded object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
            <ImageIcon className="h-4 w-4 text-text-muted" />
          </div>
        ),
    },
    {
      key: "name",
      header: t("columns.skill"),
      headerIcon: Badge,
      cell: (skill) => <span className="font-semibold text-text-primary">{skill.name}</span>,
    },
    {
      key: "slug",
      header: t("columns.slug"),
      headerIcon: Hash,
      cell: (skill) => (
        <code className="rounded bg-background-secondary px-2 py-1 text-xs">{skill.slug}</code>
      ),
    },
    {
      key: "created",
      header: t("columns.created"),
      headerIcon: Calendar,
      cell: (skill) =>
        skill.created_at ? new Date(skill.created_at).toLocaleDateString(i18n.language) : "-",
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-end",
      cell: (skill) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={isDeleting || isUpdating}
                className="h-8 w-8"
                aria-label={t("actionsFor", { name: skill.name })}
                title={t("actionsFor", { name: skill.name })}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onSelect={() => setSkillToEdit(skill)}>
                <Edit className="h-4 w-4" />
                {t("edit.action")}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onSelect={() => setSkillToUploadIcon(skill)}>
                <Upload className="h-4 w-4" />
                {t("uploadIcon")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
                onSelect={() => setSkillToDelete(skill)}
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

  const MobileSkillCard = ({ item }: { item: AdminSkillRecord }) => (
    <AdminSkillMobileCard
      skill={item}
      isDeleting={isDeleting}
      isUpdating={isUpdating}
      onEdit={setSkillToEdit}
      onUploadIcon={setSkillToUploadIcon}
      onDelete={setSkillToDelete}
    />
  )

  return (
    <>
      <DataTable
        data={skills}
        columns={columns}
        getRowId={(skill) => skill.id}
        loading={isLoading}
        pagination={{
          total: pagination?.total ?? skills.length,
          page: pagination?.currentPage ?? 1,
          lastPage: pagination?.lastPage ?? 1,
          perPage: pagination?.perPage,
        }}
        onPageChange={onPageChange}
        mobileCardComponent={MobileSkillCard}
        emptyMessage={t("empty")}
        emptyDescription={t("emptyDescription")}
        emptyImage={images.emptyProducts}
        emptyImageAlt={t("empty")}
        className="rounded-2xl bg-background-card shadow-card"
      />
      <EditSkillDialog
        skill={skillToEdit}
        isUpdating={isUpdating}
        onClose={() => {
          if (!isUpdating) setSkillToEdit(null)
        }}
        onUpdate={onUpdate}
      />
      <SkillIconUpload
        skillId={skillToUploadIcon?.id ?? ""}
        skillName={skillToUploadIcon?.name ?? ""}
        currentIcon={skillToUploadIcon?.icon}
        open={skillToUploadIcon !== null}
        onOpenChange={(open) => !open && setSkillToUploadIcon(null)}
        onSuccess={onRefetch}
      />
      <DeleteModal
        open={skillToDelete !== null}
        name={skillToDelete?.name ?? ""}
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) setSkillToDelete(null)
        }}
        onConfirm={() => {
          void confirmDelete()
        }}
      />
    </>
  )
}
