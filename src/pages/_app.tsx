import type { AppProps } from "next/app";
import initI18nProd from '@/app/i18n';
import { UserProvider } from "@/context/user-context";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "@/context/snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

initI18nProd();

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SnackbarProvider>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SnackbarProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;