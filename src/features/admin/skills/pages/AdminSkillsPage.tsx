import { Plus, Search, Wrench } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminSkillsTable from "../components/AdminSkillsTable"
import CreateSkillForm from "../components/CreateSkillForm"
import { useAdminSkills } from "../hooks/useAdminSkills"

export default function AdminSkillsPage() {
  const { t } = useTranslation("adminSkills")
  const skills = useAdminSkills()
  const [createOpen, setCreateOpen] = useState(false)

  if (skills.isError)
    return (
      <AdminFeatureError
        title={t("title")}
        error={skills.error}
        retry={() => {
          void skills.refetch()
        }}
      />
    )

  return (
    <div className="space-y-6 relative overflow-visible">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={Wrench}
        count={skills.data?.pagination.total}
        rightContent={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("form.add")}
          </Button>
        }
      />
      <CreateSkillForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        isPending={skills.createMutation.isPending}
        onCreate={(input) => skills.createMutation.mutateAsync(input)}
      />
      <div className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
        <label htmlFor="admin-skills-search" className="mb-2 block text-sm font-medium text-text-primary">
          {t("search.label")}
        </label>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            id="admin-skills-search"
            value={skills.search}
            onChange={(event) => skills.setSearch(event.target.value)}
            placeholder={t("search.placeholder")}
            className="ps-9"
          />
        </div>
      </div>
      <AdminSkillsTable
        skills={skills.data?.items ?? []}
        isLoading={skills.isPending}
        pagination={skills.data?.pagination}
        isDeleting={skills.deleteMutation.isPending}
        isUpdating={skills.updateMutation.isPending}
        onDelete={(id) => skills.deleteMutation.mutateAsync(id)}
        onUpdate={(input) => skills.updateMutation.mutateAsync(input)}
        onRefetch={() => skills.refetch()}
        onPageChange={skills.setPage}
      />
    </div>
  )
}
