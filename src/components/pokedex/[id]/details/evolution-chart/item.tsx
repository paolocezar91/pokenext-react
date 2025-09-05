import { kebabToSpace } from "@/components/shared/utils";
import Image from "next/image";
import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionItem({ evolution_details }: { evolution_details: IEvolutionDetail }) {
  return evolution_details.item?.name &&
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
    </span>;
}