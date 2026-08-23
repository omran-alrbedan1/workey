import { cn } from "@/lib/utils"

interface TextBlockProps {
  isRtl: boolean
  label: string
  value?: string | null
}

export default function TextBlock({ isRtl, label, value }: TextBlockProps) {
  return (
    <div className={cn(isRtl && "text-end")}>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm text-text-primary">{value || "-"}</p>
    </div>
  )
}
