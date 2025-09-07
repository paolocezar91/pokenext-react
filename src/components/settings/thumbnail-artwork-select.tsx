import { useSnackbar } from "@/context/snackbar";
import { useUser } from "@/context/user-context";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent } from "react";
import Select from "../shared/select";
import { ArtUrl, getArtwork } from "../shared/thumb/thumb";
import { capitilize, kebabToSpace } from "../shared/utils";

const sprites: ArtUrl[] = ['dream-world', 'home', 'official-artwork', 'showdown'];

export default function ThumbnailArtworkSelect() {
  const { settings, upsertSettings } = useUser();
  const t = useTranslations();
  const { showSnackbar } = useSnackbar();

  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ artworkUrl: e.target.value });
    showSnackbar(t('settings.artworkOptions.thumbnailArtworkUpdated'), 5);
  };

  return settings && <div className="flex flex-col sm:flex-row">
    <label htmlFor="lang" className="w-full grow">
      <div className="flex flex-col">
        <span>{t('settings.artworkOptions.thumbnailArtwork')}:</span>
        <Select
          data-testid="lang"
          id="lang"
          value={settings.artworkUrl}
          onChange={handleArtworkChange}
        >
          {
            sprites.map((key: string) => {
              return <option className="text-xs" key={key} value={key}>{capitilize(kebabToSpace(key))}</option>;
            })
          }
        </Select>
      </div>
      <div className="text-xs hover:text-(--pokedex-red)">Changes the artwork source for the thumbnail art</div>
    </label>
    <Image
      width="100"
      height="20"
      alt="Normal"
      className="md:mt-8 p-1 mt-4 md:my-0 my-4 md:ml-4 sm:ml-0 bg-white rounded"
      src={ getArtwork(1, settings.artworkUrl as ArtUrl).normal[0] } />
  </div>;
}