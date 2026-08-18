import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Building2, CheckCircle2, Clock, LogIn, Mail, ShieldCheck, XCircle } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/components/shared/logo/Logo"
import { ROUTES } from "@/config"
import { images } from "@/constants/images"
import { getErrorMessage, showErrorToast, showSuccessToast } from "@/lib/toast"
import { companyInvitationService } from "../services/companyInvitation.service"

export default function CompanyInvitationPage() {
  const { token = "" } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [completed, setCompleted] = useState<"accepted" | "rejected" | null>(null)

  const invitationQuery = useQuery({
    queryKey: ["company-invitation", token],
    queryFn: () => companyInvitationService.inspect(token),
    enabled: Boolean(token),
    retry: false,
  })

  const invitation = invitationQuery.data
  const expiresAt = useMemo(() => {
    if (!invitation?.expires_at) return null
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(invitation.expires_at))
  }, [invitation?.expires_at])

  const acceptMutation = useMutation({
    mutationFn: () =>
      companyInvitationService.accept(
        token,
        invitation?.requires_registration
          ? {
              name,
              password,
              password_confirmation: passwordConfirmation,
            }
          : {},
      ),
    onSuccess: () => {
      setCompleted("accepted")
      showSuccessToast("Invitation accepted", "You can now sign in to your employer account.")
    },
    onError: (error) => showErrorToast(error, "Unable to accept this invitation."),
  })

  const rejectMutation = useMutation({
    mutationFn: () => companyInvitationService.reject(token),
    onSuccess: () => {
      setCompleted("rejected")
      showSuccessToast("Invitation rejected")
    },
    onError: (error) => showErrorToast(error, "Unable to reject this invitation."),
  })

  const registrationInvalid =
    invitation?.requires_registration &&
    (!name.trim() || password.length < 8 || password !== passwordConfirmation)

  if (!token) {
    return <InvitationShell title="Invitation link is missing" description="Open the full invitation link sent by your company administrator." />
  }

  if (invitationQuery.isLoading) {
    return <InvitationShell title="Checking invitation" description="Please wait while we verify this invitation." />
  }

  if (invitationQuery.isError) {
    return (
      <InvitationShell
        title="Invitation unavailable"
        description={getErrorMessage(
          invitationQuery.error,
          "This invitation may be invalid, expired, already used, or rejected.",
        )}
        action={<Button asChild><Link to={ROUTES.auth.login}>Back to login</Link></Button>}
      />
    )
  }

  if (!invitation) {
    return <InvitationShell title="Invitation unavailable" description="We could not load this invitation." />
  }

  if (completed) {
    return (
      <InvitationShell
        title={completed === "accepted" ? "Invitation accepted" : "Invitation rejected"}
        description={
          completed === "accepted"
            ? "Your employer access is ready. Sign in with your account to continue."
            : "This invitation has been rejected. Contact the company administrator if this was a mistake."
        }
        action={
          completed === "accepted" ? (
            <Button onClick={() => navigate(ROUTES.auth.login)}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to={ROUTES.auth.login}>Back to login</Link>
            </Button>
          )
        }
      />
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-10">
        <section className="grid w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8">
            <Logo size="lg" alt="Workey logo" className="mb-8" />
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Company invitation
            </div>
            <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
              Join {invitation.company.name}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              You have been invited to join this company workspace on Workey.
            </p>

            <div className="mt-6 grid gap-3 text-sm">
              <InfoRow icon={Building2} label="Company" value={invitation.company.name} />
              <InfoRow icon={Mail} label="Invited email" value={invitation.email} />
              <InfoRow icon={ShieldCheck} label="Role" value={invitation.company_role.value} />
              {expiresAt && <InfoRow icon={Clock} label="Expires" value={expiresAt} />}
            </div>

            {invitation.requires_registration && (
              <div className="mt-7 space-y-4">
                <div>
                  <Label htmlFor="invitation-name">Full name</Label>
                  <Input
                    id="invitation-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="invitation-password">Password</Label>
                    <Input
                      id="invitation-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invitation-password-confirmation">Confirm password</Label>
                    <Input
                      id="invitation-password-confirmation"
                      type="password"
                      value={passwordConfirmation}
                      onChange={(event) => setPasswordConfirmation(event.target.value)}
                      placeholder="Repeat password"
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    />
                  </div>
                </div>
                {password && passwordConfirmation && password !== passwordConfirmation && (
                  <p className="text-sm text-rose-600">Passwords do not match.</p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => acceptMutation.mutate()}
                disabled={Boolean(registrationInvalid) || acceptMutation.isPending || rejectMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4" />
                {acceptMutation.isPending ? "Accepting..." : "Accept invitation"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => rejectMutation.mutate()}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
              >
                <XCircle className="h-4 w-4" />
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
          <div className="hidden min-h-[520px] lg:block">
            <img
              src={invitation.company.cover_image_url || images.workeyLoginHero}
              alt={invitation.company.name}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function InvitationShell({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <section className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <Logo size="lg" alt="Workey logo" className="mx-auto mb-8" />
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        <p className="mt-3 text-sm text-text-secondary">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </section>
    </main>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-medium text-text-primary">{value}</p>
      </div>
    </div>
  )
}
