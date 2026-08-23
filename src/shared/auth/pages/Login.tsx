import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import Logo from "@/components/shared/logo/Logo"
import { LogIn, Mail, Lock } from "lucide-react"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { loginFormSchema, LoginFormValues } from "@/shared/auth/validation/auth.validation"
import { ROUTES } from "@/config"
import { authService } from "../services/auth.service"
import { showSuccessToast } from "@/lib/toast"
import { keyOf } from "@/lib/keyValue"
import { images } from "@/constants/images"
import { isAxiosError } from "axios"

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      authService.storeSession(session)
      showSuccessToast(t("loginPage.welcomeToast"), t("loginPage.welcomeToastDesc"))

      // Redirect based on role
      const role = keyOf(session.user.role)
      if (role === "admin") {
        navigate(ROUTES.admin.root, { replace: true })
      } else if (role === "employer") {
        navigate(ROUTES.employer.root, { replace: true })
      } else {
        // Default fallback
        navigate("/", { replace: true })
      }
    },
    onError: (error: unknown) => {
      const message =
        isAxiosError(error) ? error.response?.data?.message : error instanceof Error ? error.message : ""
      form.setError("root", {
        message: message || t("loginPage.invalidCredentials"),
      })
    },
  })

  const handleSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="relative flex max-h-screen w-full flex-col md:flex-row">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="mb-4 mx-auto">
              <Logo size="xl" width={250} height={220} alt={t("loginPage.logoAlt")} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                {t("login")}
              </h1>
              <p className="text-sm text-text-secondary">{t("loginPage.subtitle")}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <CustomFormField
                    fieldType={FormFieldType.EMAIL}
                    control={form.control}
                    name="email"
                    label={t("email")}
                    placeholder="name@example.com"
                    disabled={loginMutation.isPending}
                    leftIcon={Mail}
                    iconPosition="left"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text-primary">{t("password")}</span>
                    <Link
                      to={ROUTES.auth.forgotPassword}
                      className="text-sm font-semibold text-primary transition hover:underline"
                    >
                      {t("loginPage.forgotPassword")}
                    </Link>
                  </div>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label=""
                    placeholder="************"
                    disabled={loginMutation.isPending}
                    leftIcon={Lock}
                    iconPosition="left"
                  />
                </div>
                <SubmitButton
                  isLoading={loginMutation.isPending}
                  text={t("login")}
                  loadingText={t("loginPage.submitting")}
                  icon={<LogIn className="h-4 w-4" />}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Right Panel: Image */}
      <div className="relative hidden w-1/2 md:block">
        <img
          src={images.workeyLoginHero}
          alt={t("loginPage.heroAlt")}
          className="h-screen w-full object-cover "
        />
      </div>
    </div>
  )
}

export default Login
