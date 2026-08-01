import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
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
  onCreate,
  isPending,
}: {
  onCreate: (input: AdminSkillInput) => Promise<unknown>
  isPending: boolean
}) {
  const { t } = useTranslation("adminSkills")
  const form = useForm<AdminSkillFormValues>({
    resolver: zodResolver(adminSkillSchema),
    defaultValues: { name: "", slug: "" },
  })
  const submit = async (values: AdminSkillFormValues) => {
    try {
      await onCreate(values)
      form.reset()
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="grid gap-4 rounded-2xl border border-border/60 bg-background-card p-5 shadow-card md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
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
        <Button type="submit" className="text-white" disabled={isPending}>
          <Plus /> {t("form.add")}
        </Button>
      </form>
    </Form>
  )
}
