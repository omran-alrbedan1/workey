import { cn } from "@/lib/utils"
import { 
  AlertCircle, 
  RefreshCw, 
  Home, 
  WifiOff,
  Server,
  Lock,
  FileWarning,
  LucideIcon
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button" 

export type ErrorVariant = 
  | "default" 
  | "404" 
  | "500" 
  | "403" 
  | "network" 
  | "timeout"
  | "custom"

interface ErrorStateProps {
  title?: string
  description?: string
  variant?: ErrorVariant
  icon?: LucideIcon
  image?: string
  error?: Error | string
  retry?: () => void
  goHome?: () => void
  action?: React.ReactNode
  showDefaultActions?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

const variantConfig: Record<ErrorVariant, {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  default: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  "404": {
    icon: FileWarning,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  "500": {
    icon: Server,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  "403": {
    icon: Lock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  network: {
    icon: WifiOff,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  timeout: {
    icon: AlertCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  custom: {
    icon: AlertCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  }
}

const sizeStyles = {
  sm: {
    container: "py-8 px-4",
    iconWrapper: "w-16 h-16 mb-3",
    icon: "w-8 h-8",
    title: "text-base font-semibold mb-1",
    description: "text-xs mb-4",
    actions: "gap-2"
  },
  md: {
    container: "py-12 px-6",
    iconWrapper: "w-20 h-20 mb-4",
    icon: "w-10 h-10",
    title: "text-lg font-semibold mb-2",
    description: "text-sm mb-6",
    actions: "gap-3"
  },
  lg: {
    container: "py-16 px-8",
    iconWrapper: "w-24 h-24 mb-6",
    icon: "w-12 h-12",
    title: "text-2xl font-bold mb-3",
    description: "text-base mb-8",
    actions: "gap-4"
  }
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  variant = "default",
  icon,
  image,
  error,
  retry,
  goHome,
  action,
  showDefaultActions = true,
  className,
  size = "md"
}) => {
  const { t } = useTranslation('common')
  const config = variantConfig[variant]
  const styles = sizeStyles[size]

  const titleKey: Record<ErrorVariant, string> = {
    default:  'somethingWentWrong',
    '404':    'pageNotFound',
    '500':    'errors.serverError',
    '403':    'errors.accessDenied',
    network:  'errors.networkError',
    timeout:  'errors.timeoutError',
    custom:   'error',
  }
  const descKey: Record<ErrorVariant, string> = {
    default:  'errors.defaultErrorDesc',
    '404':    'errors.pageNotFoundDesc',
    '500':    'errors.serverErrorDesc',
    '403':    'errors.accessDeniedDesc',
    network:  'errors.networkErrorDesc',
    timeout:  'errors.timeoutErrorDesc',
    custom:   'errors.customErrorDesc',
  }
  
  const IconComponent = icon || config.icon
  const displayTitle = title || t(titleKey[variant])
  const displayDescription = description || t(descKey[variant])
  
  // Extract error message if error object is provided
  const errorMessage = error instanceof Error ? error.message : error
  
  const handleRetry = () => {
    if (retry) {
      retry()
    } else {
      window.location.reload()
    }
  }
  


  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "rounded-lg border",
        config.bgColor,
        config.borderColor,
        styles.container,
        className
      )}
    >
      {image ? (
        <img 
          src={image} 
          alt={displayTitle}
          className={cn("mb-4 object-contain", {
            "w-32 h-32": size === "sm",
            "w-40 h-40": size === "md",
            "w-48 h-48": size === "lg"
          })}
        />
      ) : (
        <div className={cn(
          "rounded-full flex items-center justify-center",
          "bg-white shadow-sm",
          styles.iconWrapper
        )}>
          <IconComponent className={cn(styles.icon, config.color)} />
        </div>
      )}
      
      <h2 className={cn(
        styles.title,
        "text-gray-900"
      )}>
        {displayTitle}
      </h2>
      
      <p className={cn(
        styles.description,
        "text-gray-600 max-w-md"
      )}>
        {displayDescription}
      </p>
      
      {errorMessage && variant === "default" && (
        <div className={cn(
          "mt-3 px-3 py-2 rounded-md bg-red-100 text-red-700",
          "font-mono text-xs max-w-full overflow-auto",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          {errorMessage}
        </div>
      )}
      
      {action && (
        <div className={cn("mt-4", styles.actions)}>
          {action}
        </div>
      )}
      
      {showDefaultActions && !action && (retry || goHome) && (
        <div className={cn("flex justify-center mt-4", styles.actions)}>
            <Button
              onClick={handleRetry}
              variant="default"
              size={size === "sm" ? "sm" : "default"}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('tryAgain')}
            </Button>
        </div>
      )}
      
      {showDefaultActions && !action && !retry && !goHome && (
        <div className={cn("flex justify-center mt-4", styles.actions)}>
          <Button
            onClick={handleRetry}
            variant="default"
            size={size === "sm" ? "sm" : "default"}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('tryAgain')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ErrorState