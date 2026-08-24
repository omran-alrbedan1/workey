import {
  ArrowRight,
  Bell,
  BrainCircuit,
  CalendarDays,
  ClipboardCheck,
  FileSearch,
  ListChecks,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import LanguageSwitcher from "@/components/shared/buttons/language-switcher"
import Logo from "@/components/shared/logo/Logo"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"

const featureIcons = [
  ClipboardCheck,
  UsersRound,
  BrainCircuit,
  FileSearch,
  ListChecks,
  CalendarDays,
  Bell,
]
const workflowIcons = [
  ClipboardCheck,
  UsersRound,
  FileSearch,
  ListChecks,
  CalendarDays,
  ShieldCheck,
]

export default function EmployerLandingPage() {
  const { t, i18n } = useTranslation("employerLanding")
  const isRtl = i18n.dir() === "rtl"
  const features = t("features.items", { returnObjects: true }) as Array<{
    title: string
    description: string
  }>
  const workflow = t("workflow.steps", { returnObjects: true }) as string[]

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to={ROUTES.public.employerLanding} aria-label={t("brand")}>
            {" "}
            <Logo size="sm" alt={t("brand")} />{" "}
          </Link>
          <div className="hidden items-center gap-5 text-sm text-text-secondary lg:flex">
            <a href="#features" className="hover:text-primary">
              {t("nav.features")}
            </a>
            <a href="#workflow" className="hover:text-primary">
              {t("nav.workflow")}
            </a>
            <a href="#ai" className="hover:text-primary">
              {t("nav.ai")}
            </a>
          </div>
          <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
            <LanguageSwitcher />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to={ROUTES.employer.login}>{t("nav.signIn")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={ROUTES.employer.register}>{t("nav.createAccount")}</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28">
          <div className={cn("max-w-3xl", isRtl && "lg:text-right")}>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t("hero.eyebrow")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("hero.title")}</h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">{t("hero.description")}</p>
            <div className={cn("mt-8 flex flex-wrap gap-3", isRtl && "lg:justify-start")}>
              <Button asChild size="lg">
                <Link to={ROUTES.employer.register}>
                  {t("hero.primaryCta")}
                  <ArrowRight className={cn(isRtl && "rotate-180")} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={ROUTES.employer.login}>{t("hero.secondaryCta")}</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-text-muted">{t("hero.humanDecision")}</p>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-background-card p-6 shadow-xl">
            <p className="text-sm font-medium text-primary">{t("preview.label")}</p>
            <h2 className="mt-2 text-2xl font-semibold">{t("preview.title")}</h2>
            <div className="mt-6 space-y-3">
              {(t("preview.items", { returnObjects: true }) as string[]).map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-background-secondary p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className={cn("max-w-2xl", isRtl && "text-right")}>
          <p className="text-sm font-semibold text-primary">{t("features.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold">{t("features.title")}</h2>
          <p className="mt-3 text-text-secondary">{t("features.description")}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description }, index) => {
            const Icon = featureIcons[index]
            return (
              <article
                key={title}
                className="rounded-2xl border border-border bg-background-card p-5"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="workflow" className="bg-background-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cn(isRtl && "text-right")}>
            <p className="text-sm font-semibold text-primary">{t("workflow.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-bold">{t("workflow.title")}</h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {workflow.map((step, index) => {
              const Icon = workflowIcons[index]
              return (
                <li key={step} className="rounded-xl border border-border bg-background-card p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-xs font-semibold text-primary">{index + 1}</p>
                  <p className="mt-1 font-medium">{step}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-3xl bg-primary px-7 py-12 text-white lg:grid-cols-[.7fr_1.3fr] lg:px-12">
          <BrainCircuit className="h-20 w-20" />
          <div className={cn(isRtl && "lg:text-right")}>
            <p className="text-sm font-semibold text-white/75">{t("ai.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-bold">{t("ai.title")}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/85">{t("ai.description")}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(t("ai.items", { returnObjects: true }) as string[]).map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background-secondary/50">
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8",
            isRtl && "md:flex-row-reverse",
          )}
        >
          <div className={cn(isRtl && "md:text-right")}>
            <h2 className="text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-2 text-text-secondary">{t("finalCta.description")}</p>
          </div>
          <Button asChild size="lg">
            <Link to={ROUTES.employer.register}>
              {t("finalCta.action")}
              <ArrowRight className={cn(isRtl && "rotate-180")} />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
