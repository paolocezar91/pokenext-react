import Image from "next/image";
import { IType } from "pokeapi-typescript";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypeIcon = (type: any): string => {
  return type['sprites']['generation-viii']['sword-shield'].name_icon;
};

export default function PokemonTypes({ types }: { types: IType[] }) {
  return (<div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
    {types.map((type, i) => (
      <Image
        key={i}
        src={getTypeIcon(type)}
        width="100"
        height="20"
        alt={type.name}
      />
    ))}
  </div>);
}