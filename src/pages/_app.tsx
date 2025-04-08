import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import initI18nProd from '@/app/i18n';

initI18nProd();

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(App);