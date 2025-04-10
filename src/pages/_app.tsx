import type { AppProps } from "next/app";
import initI18nProd from '@/app/i18n';

initI18nProd();

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default (App);