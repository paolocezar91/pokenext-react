import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionGender({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  if (!evolution_details.gender) return null;
  if (evolution_details.gender === 1) {
    return <span className="text-red-500 text-xs">♀ female</span>;
  }
  if (evolution_details.gender === 2) {
    return <span className="text-blue-500 text-xs">♂ male</span>;
  }
  return null;
}
