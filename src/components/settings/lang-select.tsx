import { locales } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import Select from "../shared/select";
import { useRouter } from "next/router";

export default function LangSelect() {
  const t = useTranslations();
  const router = useRouter()
  const locale = useLocale()

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(`/${e.target.value}/settings`)
  };
  return <label htmlFor="lang">
    <div className="flex flex-col mb-4">
      <span>{t('settings.languageOptions.language')}:</span>
      <Select
        value={locale}
        data-testid="lang"
        id="lang"
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
      <div className="text-xs hover:text-(--pokedex-red) w-75">
        { t('settings.languageOptions.languageTooltip') }
      </div>
    </div>
  </label>;
}