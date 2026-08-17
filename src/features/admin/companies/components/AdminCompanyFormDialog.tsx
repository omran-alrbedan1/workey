import { useEffect, useMemo, useState } from "react"
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

const approvalOptions = [
  { value: "", label: "Keep default" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
]

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
  const initialValues = useMemo(
    () => ({
      name: company?.name ?? "",
      industry: company?.industry ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      description: company?.description ?? "",
      approvalStatus:
        typeof company?.approval_status === "object"
          ? company.approval_status.key
          : typeof company?.status === "object"
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

  const title = mode === "create" ? "Create company" : "Edit company"
  const description =
    mode === "create"
      ? "Create the company first, then invite employer users to join it."
      : "Update company profile fields stored by the backend."

  const canSubmit = values.name.trim().length > 0 && !isSubmitting

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input: AdminCompanyInput = {
      name: values.name.trim(),
      industry: nullable(values.industry),
      website: nullable(values.website),
      location: nullable(values.location),
      description: nullable(values.description),
      approval_status: values.approvalStatus || undefined,
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
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={values.name}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry</Label>
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
              <Label htmlFor="company-website">Website</Label>
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
              <Label htmlFor="company-location">Location</Label>
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
              <Label htmlFor="company-status">Approval status</Label>
              <select
                id="company-status"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={values.approvalStatus}
                onChange={(event) =>
                  setValues((current) => ({ ...current, approvalStatus: event.target.value }))
                }
                disabled={isSubmitting}
              >
                {approvalOptions.map((option) => (
                  <option key={option.value || "default"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company-description">Description</Label>
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
              <p className="mb-3 text-sm font-semibold text-text-primary">Optional owner</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="owner-name">Owner name</Label>
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
                  <Label htmlFor="owner-email">Owner email</Label>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
