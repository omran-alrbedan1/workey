import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateOption, DateRange } from "@/types/customFormField.types"
import type { SharedFieldController } from "./fieldTypes"

interface DateRangeFieldProps {
  field: SharedFieldController
  dateOptions?: DateOption
  disabled?: boolean
  inputClassName?: string
}

export const DateRangeField: React.FC<DateRangeFieldProps> = ({
  field,
  dateOptions,
  disabled,
  inputClassName,
}) => {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange>(
    (field.value as DateRange | undefined) || { from: undefined, to: undefined },
  )
  const containerRef = useRef<HTMLDivElement>(null)

  const getDisabledDays = () => {
    const disabledDays = dateOptions?.disabledDays
    if (!disabledDays || disabledDays.length === 0) return undefined
    return disabledDays
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-start font-normal",
          !range.from && "text-muted-foreground",
          inputClassName,
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="me-2 h-4 w-4" />
        {range.from
          ? range.to
            ? `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
            : format(range.from, "LLL dd, y")
          : dateOptions?.placeholder || t("datePicker.rangePlaceholder")}
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 bg-white border rounded-md shadow-lg">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(selectedRange) => {
              if (selectedRange) {
                setRange(selectedRange as DateRange)
                field.onChange(selectedRange)
              }
            }}
            disabled={getDisabledDays()}
            className="rounded-md w-56"
          />
        </div>
      )}
    </div>
  )
}
