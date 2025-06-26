import type { AppProps } from "next/app";
import initI18nProd from '@/app/i18n';
import { UserProvider } from "@/context/UserContext";
import { SessionProvider } from "next-auth/react";

initI18nProd();

function App({ Component, pageProps }: AppProps) {
  return <SessionProvider>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  </SessionProvider>;
}

export default App;