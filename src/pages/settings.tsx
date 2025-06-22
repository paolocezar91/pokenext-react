import RootLayout from "@/pages/layout";
import ArtworkSelect from "@/components/layout/artworkSelect";
import DescriptionLangSelect from "@/components/layout/descriptionLang";
import LangSelect from "@/components/layout/langSelect";
import TypeArtworkSelect from "@/components/layout/typeArtworkSelect";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t, i18n } = useTranslation('common');
  const title = t('settings.title');

  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
        <div className="p-4 bg-background rounded shadow-md h-[-webkit-fill-available] grid grid-cols-1 md:grid-cols-2">
          <div>
            <h3>{t('settings.languageOptions.title')}</h3>
            <div className="my-4">
              <LangSelect currentLanguage={i18n.language}>
                {t('settings.languageOptions.language')}:
              </LangSelect>
              <DescriptionLangSelect>
                {t('settings.languageOptions.descriptionLanguage')}:
              </DescriptionLangSelect>
            </div>
            <h3>{t('settings.artworkOptions.title')}</h3>
            <div className="my-4">
              <ArtworkSelect>
                {t('settings.artworkOptions.thumbnail')}
              </ArtworkSelect>
              <TypeArtworkSelect>
                {t('settings.artworkOptions.typeIcon')}
              </TypeArtworkSelect>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}