import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionUpsideDown({
  evolution_details,
}: {
  evolution_details: IEvolutionDetail;
}) {
  return (
    evolution_details.turn_upside_down && (
      <span className="text-xs"> level up while device is upside down</span>
    )
  );
}
