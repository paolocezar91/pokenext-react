import { defaultLocale } from "./config";

export async function getMessages(locale: string = defaultLocale) {
  return (await import(`@/locales/${locale}.json`)).default
}
 