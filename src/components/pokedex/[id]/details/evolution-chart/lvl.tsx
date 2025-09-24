import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionLevel({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.min_level &&
      <span className="text-xs"> lv. {evolution_details.min_level}</span>

  );
}
