import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { images } from "@/constants/images"
import { LogIn, Mail, Lock } from "lucide-react"  
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { loginFormSchema, LoginFormValues } from "@/shared/auth/validation/auth.validation"
import { ROUTES } from "@/config"

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      
      navigate(ROUTES.admin.root, { replace: true })
    } catch (err) {
      form.setError("root", {
        message: "Unable to login. Please check your credentials.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex max-h-screen w-full flex-col md:flex-row">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="mb-4 mx-auto">
              <img src={images.logo} width={250} height={220} alt="Workey logo" />
            </div>
            
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Login
              </h1>
              <p className="text-sm text-text-secondary">
                Welcome back! Please enter your details to login
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <CustomFormField
                    fieldType={FormFieldType.EMAIL}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    leftIcon={Mail}  
                    iconPosition="left"
                  />
                </div>

                <div>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    leftIcon={Lock}  
                    iconPosition="left"
                  />
                </div>

                {form.formState.errors.root && (
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 text-center">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <SubmitButton 
                  isLoading={isLoading}
                  text="Login"
                  loadingText="Logging in..."
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
        src={images.login}
          alt="Workey recruitment platform"
          className="h-screen w-full object-cover "
        />
      </div>
    </div>
  )
}

export default Login
