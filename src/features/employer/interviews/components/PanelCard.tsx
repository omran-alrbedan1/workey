import type { ElementType, ReactNode } from "react"

interface PanelCardProps {
  icon: ElementType
  title: string
  hint?: string
  children: ReactNode
}

export default function PanelCard({
  icon: Icon,
  title,
  hint,
  children,
}: PanelCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </h3>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  )
}
