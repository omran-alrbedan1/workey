import { UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import EmployerProfileForm from "../components/EmployerProfileForm"
import { useEmployerProfile } from "../hooks/useEmployerProfile"

export default function EmployerProfilePage() {
  const { t } = useTranslation("employerProfile")
  const profile = useEmployerProfile()

  if (profile.isError) {
    return (
      <ErrorState
        variant="network"
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void profile.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={UserRound} />
      {profile.isPending || !profile.data ? (
        <div className="h-80 animate-pulse rounded-lg bg-background-secondary" />
      ) : (
        <EmployerProfileForm
          profile={profile.data}
          isPending={profile.updateMutation.isPending}
          onSubmit={profile.updateMutation.mutateAsync}
        />
      )}
    </div>
  )
}
