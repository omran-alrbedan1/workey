import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import {
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  CheckCircle2,
  Ban,
  Package,
  Truck,
  MapPin,
  RefreshCw,
  Archive,
  FileEdit,
  WifiOff,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Coins,
  Wallet,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react"

interface StatusBadgeProps {
  status: string
  label?: string
  variant?: "default" | "pill" | "rounded" | "soft" | "outline" | "minimal"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  onRemove?: () => void
  className?: string
}

type StatusConfig = {
  icon: React.ElementType
  translationKey: string
  lightBg: string
  lightText: string
  border: string
  softBg: string
  softText: string
  dotColor?: string
}

const statusConfig: Record<string, StatusConfig> = {
  pending: {
    icon: Clock,
    translationKey: "pending",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    border: "border-amber-200",
    softBg: "bg-amber-100",
    softText: "text-amber-800",
    dotColor: "bg-amber-500",
  },
  approved: {
    icon: CheckCircle,
    translationKey: "approved",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    icon: XCircle,
    translationKey: "rejected",
    lightBg: "bg-rose-50",
    lightText: "text-rose-700",
    border: "border-rose-200",
    softBg: "bg-rose-100",
    softText: "text-rose-800",
    dotColor: "bg-rose-500",
  },
  active: {
    icon: CheckCircle2,
    translationKey: "active",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  suspended: {
    icon: Ban,
    translationKey: "suspended",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
    border: "border-red-200",
    softBg: "bg-red-100",
    softText: "text-red-800",
    dotColor: "bg-red-500",
  },
  inactive: {
    icon: Circle,
    translationKey: "inactive",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  open: {
    icon: CheckCircle2,
    translationKey: "open",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  closed: {
    icon: Archive,
    translationKey: "closed",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  unread: {
    icon: Circle,
    translationKey: "unread",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  read: {
    icon: CheckCircle2,
    translationKey: "read",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  applied: {
    icon: Clock,
    translationKey: "applied",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  screening: {
    icon: Eye,
    translationKey: "screening",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    border: "border-indigo-200",
    softBg: "bg-indigo-100",
    softText: "text-indigo-800",
    dotColor: "bg-indigo-500",
  },
  shortlisted: {
    icon: CheckCircle,
    translationKey: "shortlisted",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
    border: "border-purple-200",
    softBg: "bg-purple-100",
    softText: "text-purple-800",
    dotColor: "bg-purple-500",
  },
  test_pending: {
    icon: Clock,
    translationKey: "test_pending",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    border: "border-amber-200",
    softBg: "bg-amber-100",
    softText: "text-amber-800",
    dotColor: "bg-amber-500",
  },
  hired: {
    icon: CheckCircle2,
    translationKey: "hired",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  completed: {
    icon: CheckCircle2,
    translationKey: "completed",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  cancelled: {
    icon: XCircle,
    translationKey: "cancelled",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
    border: "border-red-200",
    softBg: "bg-red-100",
    softText: "text-red-800",
    dotColor: "bg-red-500",
  },
  accepted: {
    icon: CheckCircle,
    translationKey: "accepted",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  preparing: {
    icon: Package,
    translationKey: "preparing",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    border: "border-indigo-200",
    softBg: "bg-indigo-100",
    softText: "text-indigo-800",
    dotColor: "bg-indigo-500",
  },
  on_delivery: {
    icon: Truck,
    translationKey: "on_delivery",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
    border: "border-purple-200",
    softBg: "bg-purple-100",
    softText: "text-purple-800",
    dotColor: "bg-purple-500",
  },
  delivered: {
    icon: MapPin,
    translationKey: "delivered",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  paid: {
    icon: CheckCircle,
    translationKey: "paid",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  failed: {
    icon: XCircle,
    translationKey: "failed",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
    border: "border-red-200",
    softBg: "bg-red-100",
    softText: "text-red-800",
    dotColor: "bg-red-500",
  },
  refunded: {
    icon: RefreshCw,
    translationKey: "refunded",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
    border: "border-purple-200",
    softBg: "bg-purple-100",
    softText: "text-purple-800",
    dotColor: "bg-purple-500",
  },
  review: {
    icon: Clock,
    translationKey: "review",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    border: "border-amber-200",
    softBg: "bg-amber-100",
    softText: "text-amber-800",
    dotColor: "bg-amber-500",
  },
  published: {
    icon: CheckCircle2,
    translationKey: "published",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  draft: {
    icon: FileEdit,
    translationKey: "draft",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  scheduled: {
    icon: Clock,
    translationKey: "scheduled",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    border: "border-amber-200",
    softBg: "bg-amber-100",
    softText: "text-amber-800",
    dotColor: "bg-amber-500",
  },
  archived: {
    icon: Archive,
    translationKey: "archived",
    lightBg: "bg-rose-50",
    lightText: "text-rose-700",
    border: "border-rose-200",
    softBg: "bg-rose-100",
    softText: "text-rose-800",
    dotColor: "bg-rose-500",
  },
  offline: {
    icon: WifiOff,
    translationKey: "offline",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  cash: {
    icon: Coins,
    translationKey: "cash",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  online_payment: {
    icon: Wallet,
    translationKey: "online_payment",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  card: {
    icon: CreditCard,
    translationKey: "card",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
    border: "border-purple-200",
    softBg: "bg-purple-100",
    softText: "text-purple-800",
    dotColor: "bg-purple-500",
  },
  bank_transfer: {
    icon: Landmark,
    translationKey: "bank_transfer",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    border: "border-indigo-200",
    softBg: "bg-indigo-100",
    softText: "text-indigo-800",
    dotColor: "bg-indigo-500",
  },
  mobile_money: {
    icon: Smartphone,
    translationKey: "mobile_money",
    lightBg: "bg-teal-50",
    lightText: "text-teal-700",
    border: "border-teal-200",
    softBg: "bg-teal-100",
    softText: "text-teal-800",
    dotColor: "bg-teal-500",
  },
  visible: {
    icon: Eye,
    translationKey: "visible",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  hidden: {
    icon: EyeOff,
    translationKey: "hidden",
    lightBg: "bg-gray-50",
    lightText: "text-gray-600",
    border: "border-gray-200",
    softBg: "bg-gray-100",
    softText: "text-gray-700",
    dotColor: "bg-gray-400",
  },
  resolved: {
    icon: CheckCircle,
    translationKey: "resolved",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    border: "border-emerald-200",
    softBg: "bg-emerald-100",
    softText: "text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  reviewed: {
    icon: CheckCircle,
    translationKey: "reviewed",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  deleted: {
    icon: XCircle,
    translationKey: "deleted",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
    border: "border-red-200",
    softBg: "bg-red-100",
    softText: "text-red-800",
    dotColor: "bg-red-500",
  },
  test_completed: {
    icon: CheckCircle2,
    translationKey: "test_completed",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    border: "border-blue-200",
    softBg: "bg-blue-100",
    softText: "text-blue-800",
    dotColor: "bg-blue-500",
  },
  final_review: {
    icon: FileEdit,
    translationKey: "final_review",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    border: "border-indigo-200",
    softBg: "bg-indigo-100",
    softText: "text-indigo-800",
    dotColor: "bg-indigo-500",
  },
  on_hold: {
    icon: Clock,
    translationKey: "on_hold",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    border: "border-amber-200",
    softBg: "bg-amber-100",
    softText: "text-amber-800",
    dotColor: "bg-amber-500",
  },
}

const fallbackConfig: StatusConfig = {
  icon: AlertCircle,
  translationKey: "unknown",
  lightBg: "bg-gray-50",
  lightText: "text-gray-600",
  border: "border-gray-200",
  softBg: "bg-gray-100",
  softText: "text-gray-700",
  dotColor: "bg-gray-400",
}

const sizeStyles = {
  sm: {
    container: "px-2 py-0.5 text-[11px] gap-1",
    icon: "w-3 h-3",
    removeIcon: "w-2.5 h-2.5 ml-0.5",
    dot: "w-1.5 h-1.5",
  },
  md: {
    container: "px-2.5 py-1 text-xs gap-1.5",
    icon: "w-3.5 h-3.5",
    removeIcon: "w-3 h-3 ml-1",
    dot: "w-2 h-2",
  },
  lg: {
    container: "px-3 py-1.5 text-sm gap-2",
    icon: "w-4 h-4",
    removeIcon: "w-3.5 h-3.5 ml-1",
    dot: "w-2.5 h-2.5",
  },
}

const variantStyles = {
  default: "rounded-md border",
  pill: "rounded-full border",
  rounded: "rounded-lg border",
  soft: "rounded-md",
  outline: "rounded-full border-2 bg-transparent",
  minimal: "rounded-md border-0 bg-transparent",
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant = "default",
  size = "md",
  showIcon = true,
  onRemove,
  className,
}) => {
  const { t } = useTranslation("common")
  const statusKey = status.toLowerCase()
  const config = statusConfig[statusKey] ?? fallbackConfig
  const Icon = config.icon
  const sizeStyle = sizeStyles[size]

  const getVariantClass = () => {
    switch (variant) {
      case "outline":
        return `${config.lightText} ${config.border} bg-transparent hover:bg-opacity-5`
      case "soft":
        return `${config.softBg} ${config.softText}`
      case "minimal":
        return `${config.lightText} hover:${config.softBg} transition-colors`
      default:
        return `${config.lightBg} ${config.lightText} ${config.border}`
    }
  }

  const showDot = variant === "default" && size !== "lg" && !showIcon

  const badgeContent = (
    <>
      {showDot ? (
        <span className={cn(sizeStyle.dot, "rounded-full shrink-0", config.dotColor)} />
      ) : (
        showIcon && (
          <Icon className={cn(sizeStyle.icon, "shrink-0", variant === "minimal" && "opacity-70")} />
        )
      )}
      <span className={cn(variant === "minimal" && "font-normal")}>
        {label ?? t(`statuses.${config.translationKey}`, { defaultValue: status })}
      </span>
    </>
  )

  if (onRemove) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-medium tracking-normal transition-all duration-200",
          "hover:scale-105 hover:shadow-sm backdrop-blur-sm cursor-pointer",
          sizeStyle.container,
          variantStyles[variant],
          getVariantClass(),
          className,
        )}
        onClick={onRemove}
      >
        {badgeContent}
        <X className={cn(sizeStyle.removeIcon, "shrink-0 opacity-60 hover:opacity-100")} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-normal transition-all duration-200",
        "hover:scale-105 hover:shadow-sm cursor-default backdrop-blur-sm",
        sizeStyle.container,
        variantStyles[variant],
        getVariantClass(),
        className,
      )}
    >
      {badgeContent}
    </span>
  )
}

export default StatusBadge
