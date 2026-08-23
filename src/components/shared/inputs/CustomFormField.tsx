"use client"

import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Controller, type ControllerRenderProps, type FieldValues, type Path } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"
import {
  InputField,
  PasswordField,
  EmailField,
  TextareaField,
  NumberField,
  PhoneField,
  SelectField,
  MultiSelectField,
  ComboboxField,
  DatePickerField,
  DateRangeField,
  TimePickerField,
  DateTimePickerField,
  CheckboxField,
  CheckboxGroupField,
  RadioField,
  SwitchField,
  SliderField,
  TagInputField,
  FileUploadField,
  RatingField,
  OtpInputField,
  CurrencyField,
  PercentageField,
} from "."

import { CustomFormFieldProps } from "@/types/customFormField.types"
export enum FormFieldType {
  INPUT = "INPUT",
  PASSWORD = "PASSWORD",
  EMAIL = "EMAIL",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  PHONE = "PHONE",
  DATE_PICKER = "DATE_PICKER",
  DATE_RANGE = "DATE_RANGE",
  TIME_PICKER = "TIME_PICKER",
  DATETIME_PICKER = "DATETIME_PICKER",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  COMBOBOX = "COMBOBOX",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  CHECKBOX_GROUP = "CHECKBOX_GROUP",
  SWITCH = "SWITCH",
  SLIDER = "SLIDER",
  TAG_INPUT = "TAG_INPUT",
  FILE_UPLOAD = "FILE_UPLOAD",
  COLOR_PICKER = "COLOR_PICKER",
  RATING = "RATING",
  OTP_INPUT = "OTP_INPUT",
  AUTOCOMPLETE = "AUTOCOMPLETE",
  CURRENCY = "CURRENCY",
  PERCENTAGE = "PERCENTAGE",
}

const CustomFormField = <T extends FieldValues>(props: CustomFormFieldProps<T>) => {
  const { i18n } = useTranslation()
  const {
    fieldType,
    control,
    name,
    label,
    description,
    required,
    disabled,
    loading,
    className,
    labelClassName = "my-2",
    inputClassName,
    containerClassName,
    tooltip,
    dir,
    leftIcon,
    rightIcon,
    iconPosition,
    iconClassName,
    options,
    min,
    max,
    step,
    rows,
    maxLength,
    dateOptions,
    timeOptions,
    dateTimeOptions,
    sliderMarks,
    fileUploadOptions,
    maxRating,
    otpLength,
    tagInputOptions,
    ariaLabel,
    ariaDescribedBy,
    currency,
    locale,
  } = props
  const resolvedDir = dir ?? i18n.dir()

  const renderField = useCallback(
    (field: ControllerRenderProps<T, Path<T>>) => {
      const commonProps = {
        field,
        disabled,
        inputClassName,
        ariaLabel,
        ariaDescribedBy,
      }

      const iconProps = {
        leftIcon,
        rightIcon,
        iconPosition,
        iconClassName,
      }

      switch (fieldType) {
        case FormFieldType.INPUT:
          return (
            <InputField
              {...commonProps}
              {...iconProps}
              placeholder={props.placeholder}
              maxLength={maxLength}
            />
          )

        case FormFieldType.PASSWORD:
          return <PasswordField {...commonProps} {...iconProps} placeholder={props.placeholder} />

        case FormFieldType.EMAIL:
          return <EmailField {...commonProps} {...iconProps} placeholder={props.placeholder} />

        case FormFieldType.TEXTAREA:
          return (
            <TextareaField
              {...commonProps}
              placeholder={props.placeholder}
              rows={rows}
              maxLength={maxLength}
            />
          )

        case FormFieldType.NUMBER:
          return (
            <NumberField
              {...commonProps}
              {...iconProps}
              placeholder={props.placeholder}
              min={min}
              max={max}
              step={step}
            />
          )

        case FormFieldType.PHONE:
          return <PhoneField {...commonProps} {...iconProps} placeholder={props.placeholder} />

        case FormFieldType.SELECT:
          return <SelectField {...commonProps} placeholder={props.placeholder} options={options} />

        case FormFieldType.MULTI_SELECT:
          return (
            <MultiSelectField {...commonProps} placeholder={props.placeholder} options={options} />
          )

        case FormFieldType.COMBOBOX:
          return (
            <ComboboxField {...commonProps} placeholder={props.placeholder} options={options} />
          )

        case FormFieldType.DATE_PICKER:
          return <DatePickerField {...commonProps} dateOptions={dateOptions} />

        case FormFieldType.DATE_RANGE:
          return <DateRangeField {...commonProps} dateOptions={dateOptions} />

        case FormFieldType.TIME_PICKER:
          return <TimePickerField {...commonProps} timeOptions={timeOptions} />

        case FormFieldType.DATETIME_PICKER:
          return <DateTimePickerField {...commonProps} dateTimeOptions={dateTimeOptions} />

        case FormFieldType.CHECKBOX:
          return <CheckboxField {...commonProps} name={name} label={label} />

        case FormFieldType.CHECKBOX_GROUP:
          return <CheckboxGroupField {...commonProps} options={options} />

        case FormFieldType.RADIO:
          return <RadioField {...commonProps} options={options} />

        case FormFieldType.SWITCH:
          return <SwitchField {...commonProps} name={name} label={label} />

        case FormFieldType.SLIDER:
          return (
            <SliderField
              {...commonProps}
              min={min}
              max={max}
              step={step}
              sliderMarks={sliderMarks}
            />
          )

        case FormFieldType.TAG_INPUT:
          return (
            <TagInputField
              {...commonProps}
              placeholder={props.placeholder}
              tagInputOptions={tagInputOptions}
            />
          )

        case FormFieldType.FILE_UPLOAD:
          return (
            <FileUploadField
              {...commonProps}
              placeholder={props.placeholder}
              fileUploadOptions={fileUploadOptions}
            />
          )

        case FormFieldType.RATING:
          return <RatingField {...commonProps} maxRating={maxRating} />

        case FormFieldType.OTP_INPUT:
          return <OtpInputField {...commonProps} otpLength={otpLength} />

        case FormFieldType.CURRENCY:
          return (
            <CurrencyField
              {...commonProps}
              placeholder={props.placeholder}
              currency={currency}
              locale={locale}
            />
          )

        case FormFieldType.PERCENTAGE:
          return (
            <PercentageField {...commonProps} placeholder={props.placeholder} min={min} max={max} />
          )

        default:
          return null
      }
    },
    [
      fieldType,
      props,
      disabled,
      inputClassName,
      ariaLabel,
      ariaDescribedBy,
      leftIcon,
      rightIcon,
      iconPosition,
      iconClassName,
      maxLength,
      min,
      max,
      step,
      options,
      dateOptions,
      timeOptions,
      dateTimeOptions,
      sliderMarks,
      fileUploadOptions,
      maxRating,
      otpLength,
      rows,
      tagInputOptions,
      currency,
      locale,
      name,
      label,
    ],
  )

  const renderLabel = () => {
    if (!label && fieldType !== FormFieldType.CHECKBOX && fieldType !== FormFieldType.SWITCH) {
      return null
    }

    const labelContent = (
      <Label className={cn("text-sm font-medium ", labelClassName)}>
        {label}
        {required && <span className="text-destructive ms-1 text-red-500">*</span>}
      </Label>
    )

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                {labelContent}
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return labelContent
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={cn("space-y-4 text-start", containerClassName, className)}
          dir={resolvedDir}
        >
          {renderLabel()}
          {loading ? (
            <Skeleton className={cn("h-10 w-full", inputClassName)} />
          ) : (
            <div className="mt-2">{renderField(field)}</div>
          )}

          {description && (
            <p className={cn("text-xs text-muted-foreground", props.descriptionClassName)}>
              {description}
            </p>
          )}

          {fieldState.error && (
            <p className={cn("text-xs text-destructive text-red-500", props.errorClassName)}>
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}

export default CustomFormField
