import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronDown, Check } from "lucide-react"
import { Option } from "@/types/customFormField.types"

interface ComboboxFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
}

export const ComboboxField: React.FC<ComboboxFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  options = [],
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  
  const selectedOption = options.find((option) => option.value === field.value)
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-between text-start font-normal",
          !field.value && "text-muted-foreground",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        {selectedOption ? selectedOption.label : placeholder || "Select option"}
        <ChevronDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 bg-white border rounded-md shadow-lg w-full">
          <Command>
            <CommandInput
              placeholder="Search options..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      field.onChange(option.value)
                      setOpen(false)
                    }}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}