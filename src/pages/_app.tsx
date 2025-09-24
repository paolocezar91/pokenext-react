import type { AppProps } from "next/app";
import { UserProvider } from "@/context/user-context";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "@/context/snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "next-intl";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider locale={pageProps.locale} messages={pageProps.messages}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SnackbarProvider>
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          </SnackbarProvider>
        </SessionProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}

export default App;
