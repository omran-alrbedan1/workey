import type { ElementType } from "react"
import { cn } from "@/lib/utils"

interface DetailItemProps {
  icon: ElementType
  isRtl: boolean
  label: string
  value: string
  className?: string
}

export default function DetailItem({
  icon: Icon,
  isRtl,
  label,
  value,
  className,
}: DetailItemProps) {
  return (
    <div className={className}>
      <p
        className={cn(
          "mb-1 flex items-center gap-1.5 text-xs font-medium text-text-muted",
          isRtl && "flex-row-reverse text-end",
        )}
      >
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </p>
      <p
        className={cn("truncate text-sm font-medium text-text-primary", isRtl && "text-end")}
        title={value || undefined}
      >
        {value || "-"}
      </p>
    </div>
  )
}
