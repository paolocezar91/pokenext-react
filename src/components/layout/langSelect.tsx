import { ChangeEvent, ReactNode } from "react";
import nextI18nextConfig from "../../../next-i18next.config";
import { useTranslation } from "react-i18next";
import Select from "../shared/select";

export default function LangSelect({
  children,
  currentLanguage = 'en-US',
}: {
  children?: ReactNode,
  currentLanguage?: string,
}) {
  const { i18n } = useTranslation('common');
  const locales = nextI18nextConfig.i18n.locales;
  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  return <label htmlFor="lang">
    <div className="flex flex-col mb-4">
      <span>{children}</span>
      <Select
        data-testid="lang"
        id="lang"
        value={currentLanguage}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option
              key={lang}
              value={lang}
              className="text-xs"
            >
              {lang}
            </option>;
          })
        }
      </Select>
      <div className="text-xs hover:text-(--pokedex-red) w-75">Changes the app language</div>
    </div>
  </label>;
}