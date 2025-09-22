import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionPartyType({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  return (
    evolution_details.party_type && (
      <span className="text-xs">
        {" "}
        with {evolution_details.party_type.name}-type in party
      </span>
    )
  );
}
