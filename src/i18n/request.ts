import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale } from "./config";
import { getMessages } from "./messages";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value || defaultLocale;

  return {
    locale,
    messages: getMessages(locale),
  };
});
