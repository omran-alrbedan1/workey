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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { AdminCompanyRecord } from "@/features/admin/companies/types/adminCompanies.types"
import type { AdminTestInput } from "../types/adminTests.types"
import {
  createAdminTestSchema,
  type AdminTestFormValues,
} from "../validations/adminTests.validation"
export default function CreateTestForm({
  onCreate,
  isPending,
  onCreated,
  variant = "inline",
  companies,
  isLoadingCompanies = false,
}: {
  onCreate: (input: AdminTestInput) => Promise<unknown>
  isPending: boolean
  onCreated?: () => void
  variant?: "inline" | "dialog"
  companies: AdminCompanyRecord[]
  isLoadingCompanies?: boolean
}) {
  const { t } = useTranslation("adminTests")
  const adminTestSchema = createAdminTestSchema(t, true)
  const form = useForm<AdminTestFormValues>({
    resolver: zodResolver(adminTestSchema),
    defaultValues: {
      company_id: "",
      title: "",
      description: "",
      duration_minutes: 60,
      passing_score: 70,
    },
  })
  const submit = async (values: AdminTestFormValues) => {
    try {
      await onCreate({
        company_id: values.company_id ?? "",
        title: values.title,
        description: values.description,
        duration_minutes: values.duration_minutes,
        passing_score: values.passing_score,
      })
      form.reset()
      onCreated?.()
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }
  const formClassName =
    variant === "dialog"
      ? "space-y-4"
      : "grid gap-4 rounded-2xl border border-border/60 bg-background-card p-5 shadow-card lg:grid-cols-[1fr_1fr_1fr_180px_180px_auto] lg:items-end"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={formClassName}>
        <FormField
          control={form.control}
          name="company_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.company")}</FormLabel>
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isPending || isLoadingCompanies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCompanies
                          ? t("form.loadingCompanies")
                          : t("form.companyPlaceholder")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("form.descriptionPlaceholder")}
                  className="min-h-10 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.duration")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passing_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.passingScore")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className={"text-white " + (variant === "dialog" ? "w-full" : "")}>
          <Plus /> {t("form.add")}
        </Button>
      </form>
    </Form>
  )
}
