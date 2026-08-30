import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/config";
import { ThemeProvider } from "@/contexts/theme";
import { AuthProvider } from "@/contexts/auth";
import { ErrorBoundary } from "@/components/shared/error-boundary";

const DEFAULT_STALE_TIME = 1000 * 60 * 5;
const DEFAULT_RETRY_COUNT = 1;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      retry: DEFAULT_RETRY_COUNT,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BrowserRouter>
              <Toaster position="top-right" richColors closeButton />
              <AuthProvider>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </AuthProvider>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </I18nextProvider>
  );
}
