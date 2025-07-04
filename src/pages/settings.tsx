import RootLayout from "@/pages/layout";
import ThumbnailArtworkSelect from "@/components/settings/thumbnail-artwork-select";
import DescriptionLangSelect from "@/components/settings/description-lang";
import LangSelect from "@/components/settings/lang-select";
import TypeArtworkSelect from "@/components/settings/type-artwork-select";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/user-context";
import Spinner from "@/components/shared/spinner";

export default function SettingsPage() {
  const { t, i18n } = useTranslation('common');
  const title = t('settings.title');
  const { settings } = useUser();

  return <RootLayout title={title}>
    {settings ? <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
      <div className="p-4 bg-background rounded shadow-md h-[-webkit-fill-available] grid grid-cols-1 md:grid-cols-2">
        <div>
          <h3 className="w-fit">{t('settings.languageOptions.title')}</h3>
          <div className="my-4">
            <LangSelect currentLanguage={i18n.language} />
            <DescriptionLangSelect/>
          </div>
          <h3 className="w-fit">{t('settings.artworkOptions.title')}</h3>
          <div className="my-4">
            <ThumbnailArtworkSelect/>
            <TypeArtworkSelect/>
          </div>
        </div>
      </div>
    </div>: <Spinner />}
  </RootLayout>;
}