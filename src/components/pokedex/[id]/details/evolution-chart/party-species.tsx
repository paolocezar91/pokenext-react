import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionPartySpecies({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  return (
    evolution_details.party_species && (
      <span className="text-xs">
        {" "}
        with {evolution_details.party_species.name} in party
      </span>
    )
  );
}
