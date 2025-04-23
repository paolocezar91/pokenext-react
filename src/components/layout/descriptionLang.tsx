import { ChangeEvent, ReactNode } from "react";
import { useLocalStorage } from "../shared/utils";
import Select from "../shared/select";

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

export default function DescriptionLangSelect({
  children,
  currentLanguage = 'en',
}: {
  children?: ReactNode,
  currentLanguage?: TypeLocale,
}) {
  const [descriptionLang, setDescriptionLang] = useLocalStorage<TypeLocale>('descriptionLang', currentLanguage);
  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDescriptionLang(e.target.value as TypeLocale);
  };

  return <label htmlFor="description-lang">
    <div className="flex flex-col">
      <span>{children}</span>
      <Select
        data-testid="description-lang"
        id="description-lang"
        value={descriptionLang}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option className="text-xs" key={lang} value={lang}>{lang}</option>;
          })
        }
      </Select>
    </div>
    <div className="text-xs hover:text-(--pokedex-red) w-75">Changes the data language</div>
  </label>;
}