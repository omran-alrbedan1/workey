interface DashboardPanelProps {
  title: string
  subtitle: string
  children: React.ReactNode
  action?: React.ReactNode
}

export default function DashboardPanel({ title, subtitle, children, action }: DashboardPanelProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background-card p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
