import Image from "next/image";
import { IType } from "pokeapi-typescript";
import Tooltip from "../tooltip/tooltip";
import { capitilize } from "@/pages/pokedex/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTypeIcon = (type: any): string => {
  return type['sprites']['generation-viii']['sword-shield'].name_icon;
};

export const getTypeIconById = (typeId: string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`;
};

export default function PokemonTypes({ types }: { types: IType[] }) {
  return (<div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
    {types.map((type, i) => (
      <Image
        key={i}
        src={getTypeIcon(type)}
        width="100"
        height="20"
        alt={capitilize(type.name)}
      />
    ))}
  </div>);
}