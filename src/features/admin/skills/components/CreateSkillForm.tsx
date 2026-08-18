import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { AdminSkillInput } from "../types/adminSkills.types"
import { adminSkillSchema, type AdminSkillFormValues } from "../validations/adminSkills.validation"

export default function CreateSkillForm({
  open,
  onOpenChange,
  onCreate,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (input: AdminSkillInput) => Promise<unknown>
  isPending: boolean
}) {
  const { t } = useTranslation("adminSkills")
  const form = useForm<AdminSkillFormValues>({
    resolver: zodResolver(adminSkillSchema),
    defaultValues: { name: "", slug: "" },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  const submit = async (values: AdminSkillFormValues) => {
    try {
      await onCreate(values)
      form.reset()
      onOpenChange(false)
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("form.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("form.dialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                {t("edit.cancel")}
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {t("form.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
