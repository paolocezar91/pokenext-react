import Image from "next/image";
import { ChangeEvent, ReactNode } from "react";
import { ArtUrl, getArtwork } from "../shared/thumb/thumb";
import { capitilize, kebabToSpace, useLocalStorage } from "../shared/utils";

const sprites: ArtUrl[] = ['dream-world', 'home', 'official-artwork', 'showdown'];

export default function ArtworkSelect({children}: {children?: ReactNode}) {
  const [artworkUrl, setArtworkUrl] = useLocalStorage<ArtUrl>('artworkUrl', 'official-artwork');
  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setArtworkUrl(e.target.value as ArtUrl);
  };

  return <>
    <label htmlFor="lang">
      <div className="flex flex-col">
        <span>
          {children}
        </span>
        <select
          className="border-solid border-2 border-black text-black bg-white py-1 rounded text-xs"
          data-testid="lang"
          id="lang"
          value={artworkUrl}
          onChange={handleArtworkChange}>
          {
            sprites.map((key: string) => {
              return <option className="text-xs" key={key} value={key}>{capitilize(kebabToSpace(key))}</option>;
            })
          }
        </select>
      </div>
    </label>
    <small className="text-xs">Changes the artwork source for the thumbnail art</small>
    <span className="mt-2">
      <Image
        width="100"
        height="20"
        alt="Normal"
        className="mt-2 p-2 bg-gray-100 rounded"
        src={ getArtwork(1, artworkUrl).normal[0] } />
    </span>
  </>;
}