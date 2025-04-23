import RootLayout from "@/app/layout";
import ArtworkSelect from "@/components/layout/artworkSelect";
import DescriptionLangSelect from "@/components/layout/descriptionLang";
import LangSelect from "@/components/layout/langSelect";
import TypeArtworkSelect from "@/components/layout/typeArtworkSelect";

export default function Settings() {
  const title = 'Settings';

  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
        <div className="p-4 bg-background rounded shadow-md h-[-webkit-fill-available] grid grid-cols-1 md:grid-cols-2">
          <div>
            <h3>Language Options</h3>
            <div className="my-4">
              <LangSelect>
                Language:
              </LangSelect>
              <DescriptionLangSelect>
                Description Language:
              </DescriptionLangSelect>
            </div>
            <h3>Artwork Options</h3>
            <div className="my-4">
              <ArtworkSelect>
                Thumbnail:
              </ArtworkSelect>
              <TypeArtworkSelect>
                Type Icon:
              </TypeArtworkSelect>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}