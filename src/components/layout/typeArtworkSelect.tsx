import { ChangeEvent, ReactNode } from "react";
import { normalizeVersionGroup, useLocalStorage } from "../shared/utils";
import { getTypeIconById, TypeUrl } from "../[id]/details/types";
import Image from "next/image";
import Select from "../shared/select";

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

export default function TypeArtworkSelect({ children }: { children?: ReactNode }) {
  const [typeArtworkUrl, setTypeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', 'sword-shield');
  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeArtworkUrl(e.target.value as TypeUrl);
  };

  return <div className="flex flex-col sm:flex-row">
    <label htmlFor="lang">
      <div className="flex flex-col">
        <span>{children}</span>
        <Select
          data-testid="lang"
          id="lang"
          value={typeArtworkUrl}
          onChange={handleArtworkChange}
        >
          {
            sprites.map((key: string) => {
              return <option className="text-xs" key={key} value={key}>{normalizeVersionGroup(key)}</option>;
            })
          }
        </Select>
      </div>
      <div className="text-xs hover:text-(--pokedex-red) w-75">Changes the artwork source for the type icons</div>
    </label>
    <Image
      width={128}
      height={28}
      alt="Normal"
      className="h-[28px] md:mt-8 mt-4 md:ml-4 sm:ml-0"
      src={ getTypeIconById('12', typeArtworkUrl) } />
  </div>;
}