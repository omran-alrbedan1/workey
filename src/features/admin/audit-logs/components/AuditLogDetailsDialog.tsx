import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { AdminAuditLogRecord } from "../types/adminAuditLogs.types"

const sensitive = /(password|token|otp|secret|authorization|cookie)/i

function safe(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(safe)
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        sensitive.test(key) ? "[redacted]" : safe(entry),
      ]),
    )
  return value
}

function format(value: unknown) {
  return JSON.stringify(safe(value), null, 2)
}

export default function AuditLogDetailsDialog({
  log,
  open,
  onOpenChange,
}: {
  log: AdminAuditLogRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t, i18n } = useTranslation("adminAuditLogs")
  if (!log) return null
  const actor = log.actor
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("details.title")}</DialogTitle>
        </DialogHeader>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            [t("columns.action"), valueOf(log.action, keyOf(log.action))],
            [t("columns.actor"), valueOf(actor?.name, t("unknownActor"))],
            [t("columns.entity"), valueOf(log.entity, log.entity_type ?? "-")],
            [t("details.entityId"), String(log.entity_id ?? "-")],
            [
              t("columns.date"),
              log.created_at
                ? new Intl.DateTimeFormat(i18n.language, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(log.created_at))
                : "-",
            ],
            [t("details.ipAddress"), log.ip_address ?? "-"],
            [t("details.userAgent"), log.user_agent ?? "-"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-background-secondary p-3">
              <dt className="text-xs text-text-muted">{label}</dt>
              <dd className="mt-1 break-words text-sm">{value}</dd>
            </div>
          ))}
        </dl>
        {[
          [t("details.metadata"), log.metadata],
          [t("details.before"), log.before_values],
          [t("details.after"), log.after_values],
        ].map(([label, value]) =>
          value && Object.keys(value as object).length > 0 ? (
            <section key={label} className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">{label}</h3>
              <pre className="overflow-x-auto rounded-lg bg-background-secondary p-3 text-xs">
                {format(value)}
              </pre>
            </section>
          ) : null,
        )}
      </DialogContent>
    </Dialog>
  )
}
