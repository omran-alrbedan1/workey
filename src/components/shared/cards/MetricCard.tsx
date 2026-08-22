import React from "react"
import { LucideIcon } from "lucide-react"

interface MetricStatusCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  suffix?: string
}

export const MetricStatusCard: React.FC<MetricStatusCardProps> = ({
  title,
  value,
  icon: Icon,
  suffix = "",
}) => {
  return (
    <div className="group relative rounded-2xl border border-border bg-background-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-secondary">{title}</span>
          <div className="rounded-xl bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Icon size={18} />
          </div>
        </div>
        <div className="text-3xl font-bold text-text-primary">
          {value}
          {suffix}
        </div>
      </div>
    </div>
  )
}
