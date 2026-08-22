import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Building2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AdminCompanyDetails, AdminCompanyInput } from "../types/adminCompanies.types"

interface AdminCompanyFormDialogProps {
  open: boolean
  mode: "create" | "edit"
  company?: AdminCompanyDetails
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: AdminCompanyInput) => void
}

const approvalStatusValues = ["", "pending", "approved", "rejected", "suspended"]

function nullable(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export default function AdminCompanyFormDialog({
  open,
  mode,
  company,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: AdminCompanyFormDialogProps) {
  const { t } = useTranslation("common")
  const initialValues = useMemo(
    () => ({
      name: company?.name ?? "",
      industry: company?.industry ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      description: company?.description ?? "",
      approvalStatus:
        company?.approval_status && typeof company.approval_status === "object"
          ? company.approval_status.key
          : company?.status && typeof company.status === "object"
            ? company.status.key
            : "",
      ownerName: "",
      ownerEmail: "",
    }),
    [company],
  )

  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    if (open) setValues(initialValues)
  }, [initialValues, open])

  const title = mode === "create" ? t("companyForm.createTitle") : t("companyForm.editTitle")
  const description =
    mode === "create" ? t("companyForm.createDescription") : t("companyForm.editDescription")

  const canSubmit = values.name.trim().length > 0 && !isSubmitting

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input: AdminCompanyInput = {
      name: values.name.trim(),
      industry: nullable(values.industry),
      website: nullable(values.website),
      location: nullable(values.location),
      description: nullable(values.description),
      approval_status: values.approvalStatus ? String(values.approvalStatus) : undefined,
    }

    if (mode === "create" && values.ownerEmail.trim()) {
      input.owner = {
        email: values.ownerEmail.trim(),
        name: values.ownerName.trim() || undefined,
      }
    }

    onSubmit(input)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company-name">{t("companyForm.companyName")}</Label>
              <Input
                id="company-name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({ ...current, name: event.target.value }))
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">{t("companyForm.industry")}</Label>
              <Input
                id="company-industry"
                value={values.industry}
                onChange={(event) =>
                  setValues((current) => ({ ...current, industry: event.target.value }))
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">{t("companyForm.website")}</Label>
              <Input
                id="company-website"
                type="url"
                value={values.website}
                onChange={(event) =>
                  setValues((current) => ({ ...current, website: event.target.value }))
                }
                placeholder="https://company.com"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-location">{t("companyForm.location")}</Label>
              <Input
                id="company-location"
                value={values.location}
                onChange={(event) =>
                  setValues((current) => ({ ...current, location: event.target.value }))
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-status">{t("companyForm.approvalStatus")}</Label>
              <select
                id="company-status"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={values.approvalStatus ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, approvalStatus: event.target.value }))
                }
                disabled={isSubmitting}
              >
                {approvalStatusValues.map((value) => (
                  <option key={value || "default"} value={value}>
                    {value ? t(`statuses.${value}`) : t("companyForm.keepDefault")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company-description">{t("companyForm.description")}</Label>
              <Textarea
                id="company-description"
                value={values.description}
                onChange={(event) =>
                  setValues((current) => ({ ...current, description: event.target.value }))
                }
                disabled={isSubmitting}
                rows={4}
              />
            </div>
          </div>

          {mode === "create" && (
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-sm font-semibold text-text-primary">
                {t("companyForm.optionalOwner")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="owner-name">{t("companyForm.ownerName")}</Label>
                  <Input
                    id="owner-name"
                    value={values.ownerName}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, ownerName: event.target.value }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-email">{t("companyForm.ownerEmail")}</Label>
                  <Input
                    id="owner-email"
                    type="email"
                    value={values.ownerEmail}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, ownerEmail: event.target.value }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              <Save className="h-4 w-4" />
              {isSubmitting ? t("saving") : t("companyForm.saveCompany")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
