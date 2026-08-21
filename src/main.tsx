import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './i18n/config'
import i18n from './i18n/config'
import App from './App'
import { ThemeProvider } from './components/theme-provider'
import { APP_CONFIG, QUERY_CONFIG, STORAGE_KEYS } from './config'
import { Toaster } from './components/ui/sonner'
import { showErrorToast } from './lib/toast'

const queryClient = new QueryClient({
  ...QUERY_CONFIG,
  queryCache: new QueryCache({
    onError: (error, query) => {
      const is403 = (error as any)?.statusCode === 403
      if (query.state.data === undefined || is403) showErrorToast(error, i18n.t("common:errors.loadDataFailed"))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => showErrorToast(error),
  }),
})

document.title = `${APP_CONFIG.name} | ${APP_CONFIG.description}`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback={null}>
      <ThemeProvider defaultTheme={APP_CONFIG.theme} storageKey={STORAGE_KEYS.theme}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </React.Suspense>
  </StrictMode>,
)
