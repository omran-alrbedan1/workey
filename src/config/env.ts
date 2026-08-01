const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is required. Add it to your .env file.")
}

export const env = Object.freeze({
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: apiBaseUrl,
})
