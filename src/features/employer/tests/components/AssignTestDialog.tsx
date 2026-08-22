import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { employerApplicantsService } from "@/features/employer/applicants/services/employerApplicants.service"
import { keyOf } from "@/lib/keyValue"
import type { AssignTestPayload, EmployerTest } from "../types/employerTests.types"
import {
  assignNoApplicantsValue,
  createAssignTestSchema,
  type AssignTestFormValues,
} from "../validations/employerTests.validation"

function serializeDeadline(value: string | Date | null | undefined) {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  return value
}

interface JobOption {
  value: string
  label: string
}

interface AssignTestDialogProps {
  test: EmployerTest | null
  jobs: JobOption[]
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    applicationId: string | number,
    testId: string | number,
    data: AssignTestPayload,
  ) => Promise<unknown>
}

export default function AssignTestDialog({
  test,
  jobs,
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: AssignTestDialogProps) {
  const { t } = useTranslation("employerTests")
  const form = useForm<AssignTestFormValues>({
    resolver: zodResolver(createAssignTestSchema(t)),
    defaultValues: { job_id: "", application_id: "", note: "", deadline_at: null },
  })
  const selectedJobId = form.watch("job_id")
  const [applicants, setApplicants] = useState<{ value: string; label: string }[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)

  useEffect(() => {
    if (!open) {
      form.reset()
      setApplicants([])
    }
  }, [form, open])

  useEffect(() => {
    if (!selectedJobId) {
      setApplicants([])
      form.setValue("application_id", "")
      return
    }

    form.setValue("application_id", "")
    setLoadingApplicants(true)

    employerApplicantsService
      .list(selectedJobId, 1)
      .then((data) => {
        setApplicants(
          data.items.map((application) => {
            const userName = application.job_seeker_profile?.user?.name
            const userEmail = application.job_seeker_profile?.user?.email

            return {
              value: String(application.id),
              label: userName || userEmail || `#${application.id}`,
            }
          }),
        )
      })
      .catch((error) => {
        console.error(error)

        setApplicants([])
      })
      .finally(() => {
        setLoadingApplicants(false)
      })
  }, [selectedJobId])

  const submit = async (values: AssignTestFormValues) => {
    if (!test) return
    await onSubmit(values.application_id, test.id, {
      test_id: test.id,
      note: values.note || undefined,
      deadline_at: serializeDeadline(values.deadline_at),
      max_attempts: values.max_attempts || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-sm">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle>{t("assign.title")}</DialogTitle>
                  <DialogDescription>
                    {test ? t("assign.description", { test: test.title }) : ""}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="job_id"
                label={t("assign.job")}
                placeholder={t("assign.selectJob")}
                disabled={isPending}
                options={jobs}
              />

              {loadingApplicants ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-muted">
                    {t("assign.loadingApplicants")}
                  </p>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="application_id"
                  label={t("assign.applicant")}
                  placeholder={t("assign.selectApplicant")}
                  disabled={isPending || !selectedJobId}
                  options={
                    applicants.length === 0 && selectedJobId
                      ? [
                          {
                            value: assignNoApplicantsValue,
                            label: t("assign.noApplicants"),
                            disabled: true,
                          },
                        ]
                      : applicants
                  }
                />
              )}

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label={t("assign.note")}
                placeholder={t("assign.notePlaceholder")}
                disabled={isPending}
                rows={3}
              />

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="deadline_at"
                label={t("assign.deadline")}
                disabled={isPending}
              />

              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="max_attempts"
                label={t("assign.maxAttempts")}
                placeholder={t("assign.maxAttemptsPlaceholder")}
                disabled={isPending}
              />
            </div>
            <DialogFooter>
              <CancelButton
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("actions.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("actions.assign")}
                loadingText={t("actions.assigning")}
                icon={<Send className="h-4 w-4" />}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
