import { EvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionPhysicalStats({
  evolution_details,
}: {
  evolution_details: EvolutionDetail;
}) {
  if (typeof evolution_details.relative_physical_stats !== "number")
    return null;
  let text = "";
  if (evolution_details.relative_physical_stats === 1)
    text = "Attack > Defense";
  else if (evolution_details.relative_physical_stats === -1)
    text = "Attack < Defense";
  else if (evolution_details.relative_physical_stats === 0)
    text = "Attack = Defense";
  return <span className="text-xs">{text}</span>;
}
