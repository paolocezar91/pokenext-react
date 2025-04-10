import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from "i18next-http-backend";
import enUS from "../../public/locales/en/common.json";
import ptBR from "../../public/locales/pt/common.json";

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
      .use(initReactI18next)
      .init({
        fallbackLng: 'en-US',
        defaultNS: 'common',
        resources,
        debug: true,
        interpolation: {
          escapeValue: false
        }
      });
}

export default initI18nProd;