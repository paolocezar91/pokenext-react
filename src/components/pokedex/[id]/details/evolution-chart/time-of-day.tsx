import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionTimeOfDay({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.time_of_day &&
      <span className="text-xs"> {evolution_details.time_of_day}</span>

  );
}
