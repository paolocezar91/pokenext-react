import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import nextI18nextConfig from "../../next-i18next.config";

export default function Footer() {
  const { i18n } = useTranslation();
  const locales = nextI18nextConfig.i18n.locales;

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (<div className="footer ml-[-2rem] px-6 container fixed bottom-0 mb-6 flex justify-between">
    <div className="next flex-1 text-right">
      <select
        className="border-solid border-2 border-background text-background bg-foreground py-2 rounded"
        name="lang"
        id="lang"
        value={i18n.language}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option key={lang} value={lang}>{lang}</option>;
          })
        }
      </select>
    </div>
  </div>);
}
