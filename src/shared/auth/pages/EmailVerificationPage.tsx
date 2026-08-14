import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import EmailVerificationForm from "../components/EmailVerificationForm"
import { useEmailVerification, useResendOtp } from "../hooks/useEmailVerification"

export default function EmailVerificationPage() {
  const { t } = useTranslation("auth")
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const verify = useEmailVerification()
  const resend = useResendOtp()

  const handleVerify = (values: { email: string; otp: string }) => {
    verify.mutate(values)
  }

  const handleResend = () => {
    resend.mutate({ email })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("emailVerification.title", { defaultValue: "Verify your email" })}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("emailVerification.subtitle", {
              defaultValue: "Enter the OTP sent to your email address",
            })}
          </p>
        </div>

        <EmailVerificationForm
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          isVerifying={verify.isPending}
          isResending={resend.isPending}
        />
      </div>
    </div>
  )
}
