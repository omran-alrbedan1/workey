export const workeyTheme = {
  colors: {
    greenStart: "#29B148",
    greenMid: "#18A949",
    greenEnd: "#0FA348",
    ink: "#1B2831",
    paper: "#FDFDFD",
    surfaceSoft: "#F7F9F8",
    border: "#E1E6E3",
  },
  gradients: {
    brand: ["#29B148", "#18A949", "#0FA348"] as const,
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  typography: {
    latin: "Manrope",
    arabic: "Alexandria",
  },
} as const;

// Do not reconstruct the WORKEY logo from theme tokens.
// Use the packaged PNG/SVG-wrapper assets.
