/* eslint-disable max-len */
import { capitilize } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import { IType } from "pokeapi-typescript";

export type TypeUrl = 'omega-ruby-alpha-sapphire'|
'x-y'|
'lets-go-pikachu-lets-go-eevee'|
'sun-moon'|
'ultra-sun-ultra-moon'|
'brilliant-diamond-and-shining-pearl'|
'legends-arceus'|
'sword-shield';

const spritesUrl = (id: string): Record<TypeUrl, string> => {
  return {
    'omega-ruby-alpha-sapphire': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/omega-ruby-alpha-sapphire/${id}.png`,
    'x-y': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/${id}.png`,
    'lets-go-pikachu-lets-go-eevee': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/lets-go-pikachu-lets-go-eevee/${id}.png`,
    'sun-moon': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/sun-moon/${id}.png`,
    'ultra-sun-ultra-moon': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/ultra-sun-ultra-moon/${id}.png`,
    'brilliant-diamond-and-shining-pearl': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-and-shining-pearl/${id}.png`,
    'legends-arceus': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/${id}.png`,
    'sword-shield': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`,
  };
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTypeIcon = (type: any): string => {
  return type['sprites']['generation-viii']['sword-shield'].name_icon;
};

export const getTypeIconById = (typeId: string, sprite: TypeUrl): string => {
  return spritesUrl(typeId)[sprite];
};

export default function PokemonTypes({ types }: { types: IType[] }) {
  const { settings } = useUser();


  return settings && <div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
    {types.map((type, i) =>
      <Image
        key={i}
        src={getTypeIconById(type.id.toString(), settings.typeArtworkUrl)}
        width="100"
        height="20"
        alt={capitilize(type.name)}
      />
    )}
  </div>;
}