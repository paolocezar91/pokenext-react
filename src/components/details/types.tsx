import Image from "next/image";
import { IType } from "pokeapi-typescript";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypeIcon = (type: any): string => {
  return type['sprites']['generation-vi']['x-y'].name_icon;
};

export default function PokemonTypes({ types }: { types: IType[] }) {
  return (<div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
    {types.map((type, i) => (
      <Image
        key={i}
        src={getTypeIcon(type)}
        height="20"
        width="50"
        alt={type.name}
        className="h-5"
      />
    ))}
  </div>);
}