import DescriptionLangSelect from "@/components/settings/description-lang";
import LangSelect from "@/components/settings/lang-select";
import ThumbnailArtworkSelect from "@/components/settings/thumbnail-artwork-select";
import TypeArtworkSelect from "@/components/settings/type-artwork-select";
import LoadingSpinner from "@/components/shared/spinner";
import { useUser } from "@/context/user-context";
import { locales } from "@/i18n/config";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import RootLayout from "../../components/layout/layout";
import { getMessages } from "@/i18n/messages";

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      locale: context.params?.locale,
      messages: await getMessages(String(context.params?.locale))
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: locales.map(locale => ({ params: { locale }})),
    fallback: false
  };
}

export default function SettingsPage() {
  const t = useTranslations();
  const title = t('settings.title');
  const { settings } = useUser();

  return <RootLayout title={title}>
    {settings ? <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
      <div className="p-4 bg-background rounded shadow-md h-[-webkit-fill-available] grid grid-cols-1 md:grid-cols-2">
        <div>
          <h3 className="w-fit">{t('settings.languageOptions.title')}</h3>
          <div className="my-4">
            <LangSelect />
            <DescriptionLangSelect/>
          </div>
          <h3 className="w-fit">{t('settings.artworkOptions.title')}</h3>
          <div className="my-4">
            <ThumbnailArtworkSelect/>
            <TypeArtworkSelect/>
          </div>
        </div>
      </div>
    </div>: <LoadingSpinner />}
  </RootLayout>;
}