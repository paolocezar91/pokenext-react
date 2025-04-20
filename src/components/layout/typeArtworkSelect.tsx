import { ChangeEvent, ReactNode } from "react";
import { normalizeVersionGroup, useLocalStorage } from "../shared/utils";
import { getTypeIconById, TypeUrl } from "../[id]/details/types";
import Image from "next/image";

const sprites = [
  'omega-ruby-alpha-sapphire',
  'x-y',
  'lets-go-pikachu-lets-go-eevee',
  'sun-moon',
  'ultra-sun-ultra-moon',
  'brilliant-diamond-and-shining-pearl',
  'legends-arceus',
  'sword-shield'
];

export default function TypeArtworkSelect({children}: {children?: ReactNode}) {
  const [typeArtworkUrl, setTypeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', 'sword-shield');
  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeArtworkUrl(e.target.value as TypeUrl);
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
          value={typeArtworkUrl}
          onChange={handleArtworkChange}>
          {
            sprites.map((key: string) => {
              return <option className="text-xs" key={key} value={key}>{normalizeVersionGroup(key)}</option>;
            })
          }
        </select>
      </div>
    </label>
    <small className="xs">Changes the artwork source for the type icons</small>
    <Image
      width="100"
      height="20"
      alt="Normal"
      className="mt-2 p-2 bg-gray-100 rounded"
      src={ getTypeIconById('12', typeArtworkUrl) } />
  </>;
}