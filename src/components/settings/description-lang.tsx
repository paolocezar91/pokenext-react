import { useSnackbar } from "@/context/snackbar";
import { useUser } from "@/context/user-context";
import { ChangeEvent } from "react";
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

export default function DescriptionLangSelect() {
  const { t } = useTranslation('common');
  const { settings, upsertSettings } = useUser();
  const { showSnackbar } = useSnackbar();

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ descriptionLang: e.target.value });
    showSnackbar(t('settings.languageOptions.languageUpdate'), 5);
  };

  return settings && <label htmlFor="description-lang">
    <div className="flex flex-col">
      <span>{t('settings.languageOptions.descriptionLanguage')}:</span>
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
    <div className="text-xs hover:text-(--pokedex-red)">
      { t('settings.languageOptions.descriptionLanguageTooltip') }
    </div>
  </label>;
}