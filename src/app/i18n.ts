import i18n from 'i18next';
import Backend from "i18next-http-backend";
import { initReactI18next } from 'react-i18next';
import enUS from "../../public/locales/en-US/common.json";
import ptBR from "../../public/locales/pt-BR/common.json";

const resources = {
  'en-US': {
    common: enUS
  },
  'pt-BR': {
    common: ptBR
  }
};

function initI18nProd() {
  if(!i18n.isInitialized)
    i18n
      .use(Backend)
      // .use(LanguageDetector) // Use the language detector
      .use(initReactI18next)
      .init({
        fallbackLng: 'en-US',
        defaultNS: 'common',
        resources,
        debug: false,
        interpolation: {
          escapeValue: false
        }
      });
}

export default initI18nProd;