import { useUser } from "@/context/UserContext";
import { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
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
}: {
  children?: ReactNode,
}) {
  const { t } = useTranslation('common');
  const { settings, upsertSettings } = useUser();

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ descriptionLang: e.target.value });
  };

  return settings && <label htmlFor="description-lang">
    <div className="flex flex-col">
      <span>{children}</span>
      <Select
        data-testid="description-lang"
        id="description-lang"
        value={settings.descriptionLang}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option className="text-xs" key={lang} value={lang}>{lang}</option>;
          })
        }
      </Select>
    </div>
    <div className="text-xs hover:text-(--pokedex-red) w-75">
      { t('settings.languageOptions.descriptionLanguageTooltip') }
    </div>
  </label>;
}