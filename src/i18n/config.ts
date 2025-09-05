export type Locale = (typeof locales)[number];

export const locales = ["en-US", "pt-BR"];
export const defaultLocale: Locale = "en-US";