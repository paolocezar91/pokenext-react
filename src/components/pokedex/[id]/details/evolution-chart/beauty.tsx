import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionBeauty({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  return (
    evolution_details.min_beauty && (
      <span className="text-xs"> beauty ≥ {evolution_details.min_beauty}</span>
    )
  );
}
