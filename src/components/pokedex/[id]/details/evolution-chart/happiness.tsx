import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionHappiness({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.min_happiness &&
      <span className="text-xs">high friendship </span>

  );
}
