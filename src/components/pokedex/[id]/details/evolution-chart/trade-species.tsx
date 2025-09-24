import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionTradeSpecies({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  return (
    evolution_details.trade_species && (
      <span className="text-xs">
        {" "}
        trade for {evolution_details.trade_species.name}
      </span>
    )
  );
}
