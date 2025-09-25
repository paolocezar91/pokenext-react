import { kebabToSpace } from "@/components/shared/utils";
import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionLocation({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.location?.name &&
      <span className="text-xs">
        {" "}
        at {kebabToSpace(evolution_details.location.name)}{" "}
      </span>

  );
}
