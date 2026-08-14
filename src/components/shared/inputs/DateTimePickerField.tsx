import React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DateTimeOption } from "@/types/customFormField.types"

interface DateTimePickerFieldProps {
  field: any
  dateTimeOptions?: DateTimeOption
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  field,
  dateTimeOptions,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  leftIcon,
  rightIcon,
  iconPosition,
  iconClassName,
}) => {
  const hasLeftIcon =
    leftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")
  const hasRightIcon = rightIcon && (iconPosition === "right" || iconPosition === "both")

  const LeftIcon = leftIcon
  const RightIcon = rightIcon

  return (
    <div className="relative">
      {hasLeftIcon && LeftIcon && (
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary ltr:left-4 rtl:right-4">
          <LeftIcon
            className={cn(
              "h-5 w-5 text-muted-foreground group-focus-within:text-primary",
              iconClassName
            )}
          />
        </div>
      )}
      {hasRightIcon && RightIcon && (
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary ltr:right-4 rtl:left-4">
          <RightIcon
            className={cn(
              "h-5 w-5 text-muted-foreground group-focus-within:text-primary",
              iconClassName
            )}
          />
        </div>
      )}
      <Input
        {...field}
        type="datetime-local"
        disabled={disabled}
        min={dateTimeOptions?.minDate ? toDateTimeLocal(dateTimeOptions.minDate) : undefined}
        max={dateTimeOptions?.maxDate ? toDateTimeLocal(dateTimeOptions.maxDate) : undefined}
        step={dateTimeOptions?.step}
        className={cn(
          inputClassName,
          "px-6 py-4 text-base",
          hasLeftIcon && "ltr:pl-14 rtl:pr-14",
          hasRightIcon && "ltr:pr-14 rtl:pl-14"
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  )
}
