import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import {
  createEmailVerificationSchema,
  type EmailVerificationFormValues,
} from "../validation/emailVerification.validation"

interface EmailVerificationFormProps {
  email: string
  onVerify: (values: EmailVerificationFormValues) => void
  onResend: () => void
  isVerifying?: boolean
  isResending?: boolean
}

export default function EmailVerificationForm({
  email,
  onVerify,
  onResend,
  isVerifying = false,
  isResending = false,
}: EmailVerificationFormProps) {
  const { t } = useTranslation("common")
  const form = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(createEmailVerificationSchema(t)),
    defaultValues: { email, otp: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onVerify)} className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t("emailVerification.otpSentTo")} <span className="font-semibold">{email}</span>
          </p>
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="otp"
          label={t("emailVerification.otpLabel")}
          placeholder={t("emailVerification.otpPlaceholder")}
          disabled={isVerifying}
          leftIcon={ShieldCheck}
          iconPosition="left"
        />

        <div className="flex gap-2">
          <SubmitButton
            isLoading={isVerifying}
            text={t("emailVerification.verify")}
            loadingText={t("emailVerification.verifying")}
            icon={<ShieldCheck className="h-4 w-4" />}
            className="flex-1"
          />
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="px-4 py-2 border border-input rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
            <span className="text-sm">{t("emailVerification.resend")}</span>
          </button>
        </div>
      </form>
    </Form>
  )
}
