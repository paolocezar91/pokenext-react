// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'pt-BR'],
    domains: []
  },
  fallbackLng: 'en-US',
  ns: ['common'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { useSuspense: false }
};
