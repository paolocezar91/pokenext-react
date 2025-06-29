import Image from "next/image";
import { ChangeEvent, ReactNode } from "react";
import { ArtUrl, getArtwork } from "../shared/thumb/thumb";
import { capitilize, kebabToSpace } from "../shared/utils";
import Select from "../shared/select";
import { useUser } from "@/context/UserContext";

const sprites: ArtUrl[] = ['dream-world', 'home', 'official-artwork', 'showdown'];

export default function ArtworkSelect({ children }: { children?: ReactNode }) {
  const { settings, upsertSettings } = useUser();

  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ artworkUrl: e.target.value });
  };

  return settings && <div className="flex flex-col sm:flex-row">
    <label htmlFor="lang">
      <div className="flex flex-col">
        <span>{children}</span>
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
      <div className="text-xs hover:text-(--pokedex-red) w-75">Changes the artwork source for the thumbnail art</div>
    </label>
    <Image
      width="100"
      height="20"
      alt="Normal"
      className="md:mt-8 p-1 mt-4 md:my-0 my-4 md:ml-4 sm:ml-0 bg-white rounded"
      src={ getArtwork(1, settings.artworkUrl as ArtUrl).normal[0] } />
  </div>;
}