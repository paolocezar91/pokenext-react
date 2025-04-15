import { kebabToSpace } from "@/pages/pokedex/utils";
import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionLocation({evolution_details}: {evolution_details: IEvolutionDetail}) {
  return evolution_details.location?.name &&
    <span className="text-xs"> at {kebabToSpace(evolution_details.location.name)} </span>
  ;
}