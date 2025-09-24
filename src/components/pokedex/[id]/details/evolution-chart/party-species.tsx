import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionPartySpecies({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  return (
    evolution_details.party_species &&
      <span className="text-xs">
        {" "}
        with {evolution_details.party_species.name} in party
      </span>

  );
}
