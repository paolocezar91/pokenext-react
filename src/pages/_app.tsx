import type { AppProps } from "next/app";
import initI18nProd from '@/app/i18n';
import { UserProvider } from "@/context/user-context";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "@/context/snackbar";

initI18nProd();

function App({ Component, pageProps }: AppProps) {
  return <SessionProvider>
    <UserProvider>
      <SnackbarProvider>
        <Component {...pageProps} />
      </SnackbarProvider>
    </UserProvider>
  </SessionProvider>;
}

export default App;