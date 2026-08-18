import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { DateOption } from "@/types/customFormField.types"

interface DatePickerFieldProps {
  field: any
  dateOptions?: DateOption
  disabled?: boolean
  inputClassName?: string
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  dateOptions,
  disabled,
  inputClassName,
}) => {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const getDisabled = () => {
    const disabledOptions: any = {}
    
    if (dateOptions?.minDate) {
      disabledOptions.before = dateOptions.minDate
    }
    if (dateOptions?.maxDate) {
      disabledOptions.after = dateOptions.maxDate
    }
    
    const disabledDays = dateOptions?.disabledDays
    if (disabledDays && disabledDays.length > 0) {
      if (Object.keys(disabledOptions).length > 0) {
        return [disabledOptions, ...disabledDays]
      }
      return disabledDays
    }
    
    return Object.keys(disabledOptions).length > 0 ? disabledOptions : undefined
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-start font-normal",
          !field.value && "text-muted-foreground",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="me-2 h-4 w-4" />
        {field.value ? (
          format(new Date(field.value), dateOptions?.format || "PPP")
        ) : (
          dateOptions?.placeholder || t("datePicker.placeholder")
        )}
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 bg-white border rounded-md shadow-lg min-w-[280px]">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => {
              field.onChange(date ? format(date, "yyyy-MM-dd") : null)
              setOpen(false)
            }}
            disabled={getDisabled()}
            className="rounded-md w-full"
          />
        </div>
      )}
    </div>
  )
}
