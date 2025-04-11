import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionLevel({evolution_details}: {evolution_details: IEvolutionDetail}) {
  return (evolution_details.min_level &&
    <span className="text-xs"> lvl {evolution_details.min_level}</span>);
}