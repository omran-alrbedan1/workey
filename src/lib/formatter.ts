import i18n from "@/i18n/config"

export const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/\D/g, "")
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

export const generateId = () => Math.random().toString(36).substr(2, 9)

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatETA(isoDate: string): string {
  const eta = new Date(isoDate)
  const now = new Date()
  const diffMs = eta.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / 60000)

  if (diffMins <= 0) return "Arriving now"
  if (diffMins < 60) return `In ${diffMins} min`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return `In ${hours}h${mins > 0 ? ` ${mins}m` : ""}`
}

export function formatAddress(address: any): string {
  return address
    .split(",")
    .map((part: any) => part.trim())
    .filter(Boolean)
    .join(", ")
}

export function formatJoinedDate(date: string | null | undefined, locale: string): string {
  if (!date) return "-"

  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
export const formatDate = (dateStr: string): string => {
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US"
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
