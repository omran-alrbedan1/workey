import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import type { SharedFieldController } from "./fieldTypes"

interface PasswordFieldProps {
  field: SharedFieldController
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  leftIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  leftIcon: LeftIcon,
  iconPosition,
  iconClassName,
}) => {
  const { i18n } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const hasLeftIcon =
    LeftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")
  const isRtl = i18n.dir() === "rtl"

  return (
    <div className="relative group">
      {hasLeftIcon && LeftIcon && (
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary ltr:left-4 rtl:right-4">
          <LeftIcon className={cn("h-5 w-5 group-focus:text-primary", iconClassName)} />
        </div>
      )}
      <Input
        {...field}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          inputClassName,
          "px-6 py-5 text-base text-start",
          hasLeftIcon && "ltr:pl-14 rtl:pr-14",
          "ltr:pr-14 rtl:pl-14",
        )}
        dir="ltr"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "absolute top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full p-0 hover:bg-transparent",
          isRtl ? "start-3" : "end-3",
        )}
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 group-focus:text-primary transition-colors" />
        ) : (
          <Eye className="h-4 w-4 group-focus:text-primary transition-colors" />
        )}
      </Button>
    </div>
  )
}
