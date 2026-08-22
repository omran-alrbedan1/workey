import { Component, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WidgetErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface WidgetErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Widget error caught:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <WidgetErrorFallback error={this.state.error} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

function WidgetErrorFallback({ error, onRetry }: { error?: Error; onRetry: () => void }) {
  const { t } = useTranslation("common")

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-text-primary">{t("somethingWentWrong")}</p>
      <p className="mt-1 text-xs text-text-muted">
        {error?.message || t("errors.defaultErrorDesc")}
      </p>
      <Button onClick={onRetry} variant="outline" size="sm" className="mt-3 gap-2">
        <RefreshCw className="h-3 w-3" />
        {t("retry")}
      </Button>
    </div>
  )
}
