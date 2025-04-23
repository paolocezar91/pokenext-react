import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { IPokemonSpecies } from "pokeapi-typescript";

export default function PokemonMisc({
  species
} : {
  species: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean }
}) {

  console.log(species);

  return <div className="pokemon-first-appearance col-span-6 md:col-span-3 mt-4">
    <div className="flex flex-wrap gap-4">
      {
        [
          ['Egg Groups', species?.egg_groups.map(eg => capitilize(eg.name)).join(', ')],
          ['Baby', species.is_baby ? 'Yes' : 'No'],
          ['Legendary', species.is_legendary ? 'Yes' : 'No'],
          ['Mythical', species.is_mythical ? 'Yes': 'No']
        ].map(([key, value]) => {
          return <div className="flex-1" key={key}>
            <small className="block border-b-2 mb-1">{key}:</small>
            <span>{value}</span>
          </div>;
        })
      }
    </div>
  </div>;
}