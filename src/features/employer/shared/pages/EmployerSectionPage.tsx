import type { LucideIcon } from "lucide-react"
import { Construction } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import EmptyState from "@/components/shared/states/EmptyState"

export default function EmployerSectionPage({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  const { t } = useTranslation("employerShared")

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} icon={icon} />
      <EmptyState
        title={t("placeholder.title")}
        description={t("placeholder.description")}
        icon={Construction}
        className="min-h-80 border border-dashed border-border bg-background-card"
      />
    </div>
  )
}
