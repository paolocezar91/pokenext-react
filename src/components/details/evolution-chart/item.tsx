import Image from "next/image";
import { kebabToSpace } from "./evolution-chart";
import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionItem({evolution_details}: {evolution_details: IEvolutionDetail}) {
  console.log(evolution_details.item);
  return (evolution_details.item?.name &&
    <span> use
      <span className="flex flex-col items-center text-xs">
        {kebabToSpace(evolution_details.item?.name)}
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolution_details.item?.name}.png`}
          width={30}
          height={30}
          alt={kebabToSpace(evolution_details.item?.name)}
        />
      </span>
    </span>);
}