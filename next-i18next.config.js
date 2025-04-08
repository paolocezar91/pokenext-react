// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
  },
  fallbackLng: 'en',
  ns: ['common'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { useSuspense: false }
};
