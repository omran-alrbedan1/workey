import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { format, setHours, setMinutes } from "date-fns"
import { TimeOption } from "@/types/customFormField.types"

interface TimePickerFieldProps {
  field: any
  timeOptions?: TimeOption
  disabled?: boolean
  inputClassName?: string
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  field,
  timeOptions,
  disabled,
  inputClassName,
}) => {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)
  const interval = timeOptions?.interval || 30
  
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = setMinutes(setHours(new Date(), hour), minute)
        slots.push(time)
      }
    }
    return slots
  }
  
  const timeSlots = generateTimeSlots()
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-start font-normal",
          !field.value && "text-muted-foreground",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <Clock className="me-2 h-4 w-4" />
        {field.value ? (
          format(new Date(field.value), timeOptions?.format || "p")
        ) : (
          timeOptions?.placeholder || t("datePicker.timePlaceholder")
        )}
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 bg-white border rounded-md shadow-lg">
          <div className="max-h-60 overflow-y-auto p-2">
            {timeSlots.map((time, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start px-3 py-2"
                onClick={() => {
                  field.onChange(time)
                  setOpen(false)
                }}
              >
                {format(time, "p")}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}