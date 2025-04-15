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

  return <div className="footer container w-full fixed bottom-0 flex justify-between border-solid border-t-2 border-(--pokedex-red-light) bg-(--pokedex-red) py-2 px-4">
    <div className="flex items-center text-xs">
      <p>
        By <Link href="https://github.com/paolocezar91/" target="_blank" className="underline">Paolo Pestalozzi</Link> with <Link href="https://pokeapi.co/" target="_blank" className="underline">PokeAPI</Link> and <Link href="http://nextjs.org/" target="_blank" className="underline">Next.js</Link>.
      </p>
    </div>
    <div className="next flex-1 text-right">
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
  </div>;
}
