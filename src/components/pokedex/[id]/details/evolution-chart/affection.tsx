import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionAffection({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.min_affection &&
      <span className="text-xs">
        {" "}
        affection ≥ {evolution_details.min_affection}
      </span>

  );
}
