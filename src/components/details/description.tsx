import { capitilize, kebabToSpace, normalizePokemonName } from "@/pages/pokedex/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useState } from "react";


export default function PokemonDescription({ species }: { species: IPokemonSpecies }) {
  const [flavorIdx, setFlavorIdx] = useState(0);

  const getFlavorText = (species: IPokemonSpecies) => {
    return species?.flavor_text_entries.filter((text) => text.language.name === 'en').map((flavor) => {
      return {
        flavor_text: flavor.flavor_text.replace('', ' ') || '',
        version_group_name: flavor.version.name
      };
    });
  };

  return <div className="pokemon-description col-span-2 capitilize">
    <h2 className="text-xl font-semibold mb-4 ">
      <span>
        { normalizePokemonName(species.name) } -- {species.genera.find(g => g.language.name === 'en')?.genus}
      </span>
    </h2>
    <div className="flex relative  pb-8">
      <button
        onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
        disabled={flavorIdx === 0}
        className="text-xs mr-2 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
      >
        <ChevronLeftIcon />
      </button>
      <p>{getFlavorText(species)[flavorIdx].flavor_text}</p>
      <button
        onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
        disabled={getFlavorText(species).length - 1 === flavorIdx}
        className="text-xs ml-2 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
      >
        <ChevronRightIcon className="w-5" />
      </button>
      <div className="absolute bottom-0 right-0">
        <small className="mr-2">({ capitilize(kebabToSpace(getFlavorText(species)[flavorIdx].version_group_name)) })</small>
        {flavorIdx + 1} / {getFlavorText(species).length}
      </div>
    </div>
  </div>;
}