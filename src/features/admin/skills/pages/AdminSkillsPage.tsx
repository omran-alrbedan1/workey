import { Wrench } from "lucide-react"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminSkillsTable from "../components/AdminSkillsTable"
import CreateSkillForm from "../components/CreateSkillForm"
import { useAdminSkills } from "../hooks/useAdminSkills"
import { useTranslation } from "react-i18next"
export default function AdminSkillsPage() {
  const { t } = useTranslation("adminSkills")
  const skills = useAdminSkills()
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
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={Wrench}
        count={skills.data?.pagination.total}
      />
      <CreateSkillForm
        isPending={skills.createMutation.isPending}
        onCreate={(input) => skills.createMutation.mutateAsync(input)}
      />
      <AdminSkillsTable
        skills={skills.data?.items ?? []}
        isLoading={skills.isPending}
        pagination={skills.data?.pagination}
        isDeleting={skills.deleteMutation.isPending}
        isUpdating={skills.updateMutation.isPending}
        onDelete={(id) => skills.deleteMutation.mutateAsync(id)}
        onUpdate={(input) => skills.updateMutation.mutateAsync(input)}
        onRefetch={() => skills.refetch()}
      />
    </div>
  )
}
