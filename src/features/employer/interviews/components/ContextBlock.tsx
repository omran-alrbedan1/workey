import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContextBlockProps {
  isRtl: boolean
  label: string
  children: ReactNode
}

export default function ContextBlock({ isRtl, label, children }: ContextBlockProps) {
  return (
    <div className={cn(isRtl && "text-end")}>
      <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
