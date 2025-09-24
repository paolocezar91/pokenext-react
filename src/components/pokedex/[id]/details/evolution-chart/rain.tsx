import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionRain({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.needs_overworld_rain &&
      <span className="text-xs"> while raining</span>

  );
}
