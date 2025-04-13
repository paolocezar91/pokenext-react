import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import nextI18nextConfig from "../../next-i18next.config";
import Tooltip from "./tooltip/tooltip";
import Link from "next/link";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const locales = nextI18nextConfig.i18n.locales;

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (<div className="footer container fixed bottom-0 flex justify-between border-solid border-t-4 border-(--pokedex-red-light) bg-(--pokedex-red)">
    <div className="flex items-center text-xs p-4">
      <Link href="https://github.com/paolocezar91/">Done by Paolo Pestalozzi</Link>
    </div>
    <div className="next flex-1 text-right p-4">
      <Tooltip content={t('footer.languages')}>
        <select
          className="border-solid border-2 border-background text-background bg-foreground py-2 rounded text-xs"
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
      </Tooltip>
    </div>
  </div>);
}
