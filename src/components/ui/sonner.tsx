import { Toaster as SonnerToaster, type ToasterProps } from "sonner"

import { useTheme } from "../theme-provider"

export function Toaster(props: ToasterProps) {
  const { theme } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "group toast border-border bg-background-card text-text-primary shadow-soft",
          description: "text-text-secondary",
          actionButton: "bg-primary text-white",
          cancelButton: "bg-background-secondary text-text-primary",
        },
      }}
      {...props}
    />
  )
}
