import RootLayout from "@/app/layout";
import { getTypeIconById, TypeUrl } from "@/components/[id]/details/types";
import ArtworkSelect from "@/components/layout/artworkSelect";
import DescriptionLangSelect from "@/components/layout/descriptionLang";
import LangSelect from "@/components/layout/langSelect";
import TypeArtworkSelect from "@/components/layout/typeArtworkSelect";
import PokemonThumb from "@/components/shared/thumb/thumb";
import { useLocalStorage } from "@/components/shared/utils";
import Image from "next/image";

export default function Settings() {
  const [typeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', "sword-shield");


  const title = 'Settings';

  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
        <div className="mx-auto p-4 bg-background rounded shadow-md h-[-webkit-fill-available]">
          <div className="w-[50%]">
            <h3>Language Options</h3>
            <div className="flex my-4">
              <div className="flex items-start justify-between">
                <div className="mr-4 flex flex-col">
                  <LangSelect>
                    <span className="text-xs">Language:</span>
                  </LangSelect>
                </div>
                <div className="flex flex-col">
                  <DescriptionLangSelect>
                    <span className="text-xs">Description Language:</span>
                  </DescriptionLangSelect>
                </div>
              </div>
            </div>
            <h3>Artwork Options</h3>
            <div className="flex my-4">
              <div className="flex items-start justify-between">
                <div className="mr-4 flex flex-col">
                  <ArtworkSelect>
                    <span className="text-xs">Thumbnail:</span>
                  </ArtworkSelect>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <TypeArtworkSelect>
                    <span className="text-xs">Type Icon:</span>
                  </TypeArtworkSelect>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}