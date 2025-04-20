import { ChangeEvent, ReactNode } from "react";
import { useLocalStorage } from "../shared/utils";

const locales = [
  "en",
  "fr",
  "ja-Hrkt",
  "ko",
  "de" ,
  "es",
  "it",
  "ja",
  "zh-Hant",
  "zh-Hans"
];

export type TypeLocale = "en" |
    "fr" |
    "ja-Hrkt" |
    "ko" |
    "de" |
    "es" |
    "it" |
    "ja" |
    "zh-Hant" |
    "zh-Hans";

export default function DescriptionLangSelect({ currentLanguage = 'en', children }: { currentLanguage?: TypeLocale, children?: ReactNode }) {
  const [descriptionLang, setDescriptionLang] = useLocalStorage<TypeLocale>('descriptionLang', currentLanguage);
  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDescriptionLang(e.target.value as TypeLocale);
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
        value={descriptionLang}
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