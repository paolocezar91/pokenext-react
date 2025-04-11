import { kebabToCapitilize } from "./evolution-chart";
import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionLocation({evolution_details}: {evolution_details: IEvolutionDetail}) {
  return (evolution_details.location?.name &&
    <span className="text-xs"> at {kebabToCapitilize(evolution_details.location.name)} </span>
  );
}