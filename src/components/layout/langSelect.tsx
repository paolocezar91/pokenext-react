import { ChangeEvent, ReactNode } from "react";
import nextI18nextConfig from "../../../next-i18next.config";
import { useTranslation } from "react-i18next";

export default function LangSelect({ currentLanguage = 'en-US', children }: { currentLanguage?: string, children?: ReactNode }) {
  const { i18n } = useTranslation();
  const locales = nextI18nextConfig.i18n.locales;
  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  return <label htmlFor="lang">
    <div className="flex flex-col">
      <span>
        {children}
      </span>
      <select
        className="border-solid border-2 border-black text-black bg-white py-1 rounded text-xs"
        data-testid="lang"
        id="lang"
        value={currentLanguage}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option className="text-xs" key={lang} value={lang}>{lang}</option>;
          })
        }
      </select>
    </div>
  </label>;
}