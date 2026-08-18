import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  text?: string
  icon?: React.ReactNode
}

export const SubmitButton = ({
  isLoading = false,
  loadingText,
  text,
  icon,
  className,
  disabled,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full bg-primary hover:bg-primary-dark text-text-on-primary",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="ms-2 h-4 w-4 animate-spin" />
          {loadingText || text }
        </>
      ) : (
        <>
          {icon && <span className="ms-2">{icon}</span>}
          {text}
        </>
      )}
    </Button>
  )
}