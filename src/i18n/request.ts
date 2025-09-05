import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale } from './config';
 
export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || defaultLocale;
 
  return {
    locale,
    messages: (await import(`@/locales/${locale}/common.json`)).default
  };
});

