import { locales } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import Select from "../shared/select";
import { useRouter } from "next/router";
import { LanguageIcon } from "@heroicons/react/24/solid";

export default function LangSelect() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const languages: Record<string, string> = {
    en: "English",
    "pt-BR": "Português",
  };

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const route = router.asPath.split("/").reduce((acc, item, i) => {
      if (i === 0) return acc;
      if (i === 1) return `${acc}/${e.target.value}`;
      return `${acc}/${item}`;
    }, "");
    router.push(route);
  };
  return (
    <label htmlFor="lang" className="flex items-center">
      <label htmlFor="lang" className="pr-2">
        <LanguageIcon className="w-5" />
      </label>
      <Select
        className="py-0! px-1! border-0!"
        value={locale}
        data-testid="lang"
        id="lang"
        onChange={handleLangChange}
      >
        {locales.map((lang: string) => {
          return (
            <option
              key={lang}
              value={lang}
              className="text-xs bg-white text-black"
            >
              {languages[lang]}
            </option>
          );
        })}
      </Select>
    </label>
  );
}
