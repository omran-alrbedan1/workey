import type { AdminSettingsView } from "../types/adminSettings.types"
import { useTranslation } from "react-i18next"
export default function AdminSettingsDetails({ settings }: { settings: AdminSettingsView }) {
  const { t } = useTranslation("adminSettings")
  return (
    <div className="grid gap-4 rounded-2xl border border-border/60 bg-background-card p-6 shadow-card md:grid-cols-2">
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="rounded-xl bg-background-secondary p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t(`fields.${key}`)}
          </p>
          <p className="mt-2 break-all text-sm font-medium text-text-primary">{String(value)}</p>
        </div>
      ))}
    </div>
  )
}
