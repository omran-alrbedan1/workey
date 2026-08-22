import { useTheme } from "@/components/theme-provider"
import { images } from "@/constants/images"
import { cn } from "@/lib/utils"

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl"

const sizeClasses: Record<LogoSize, string> = {
  xs: "h-8 w-auto",
  sm: "h-10 w-auto",
  md: "h-14 w-auto",
  lg: "h-16 w-auto",
  xl: "h-24 w-auto",
}

interface LogoProps {
  size?: LogoSize
  className?: string
  alt?: string
  width?: number
  height?: number
}

export default function Logo({ size = "md", className, alt = "Workey", width, height }: LogoProps) {
  const { theme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <img
      src={images.logo}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "workey-logo",
        sizeClasses[size],
        "object-contain",
        isDark && "brightness-110 contrast-105",
        className,
      )}
    />
  )
}
