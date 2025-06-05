import { TypeLocale } from "@/components/layout/descriptionLang";
import { capitilize, kebabToSpace, normalizePokemonName, useLocalStorage } from "@/components/shared/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useState } from "react";
import { Button } from "react-bootstrap";
import PokemonMisc from "./misc";


export default function PokemonDescription({ species }: { species: IPokemonSpecies }) {
  const [flavorIdx, setFlavorIdx] = useState(0);
  const [descriptionLang] = useLocalStorage<TypeLocale>('descriptionLang', 'en');


  const getFlavorText = (species: IPokemonSpecies) => {
    return species?.flavor_text_entries
      .filter((text) => text.language.name === descriptionLang)
      .map((flavor) => {
        return {
          flavor_text: flavor.flavor_text.replace('', ' ') || '',
          version_group_name: flavor.version.name
        };
      });
  };

  return <div className="pokemon-description col-span-6 capitilize">
    <h2 className="text-xl font-semibold mb-4 bg-background z-10">
      <span>
        { normalizePokemonName(species.name) } -- {species.genera.find(g => g.language.name === descriptionLang)?.genus}
      </span>
    </h2>
    { getFlavorText(species).length > 0 && <div className="flex items-end relative justify-between items-start pb-6">
      <div>{getFlavorText(species)[flavorIdx].flavor_text}</div>
      <div className="flex">
        <Button
          onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
          disabled={flavorIdx === 0}
          className="text-xs mr-1 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
        >
          <ChevronLeftIcon className="w-5" />
        </Button>
        <Button
          onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
          disabled={getFlavorText(species).length - 1 === flavorIdx}
          className="text-xs ml-1 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
        >
          <ChevronRightIcon className="w-5" />
        </Button>
      </div>
      <div className="absolute bottom-0 right-0 border-t-1 border-t-white text-xs">
        <small className="mr-2">({ capitilize(kebabToSpace(getFlavorText(species)[flavorIdx].version_group_name)) })</small>
        {flavorIdx + 1} / {getFlavorText(species).length}
      </div>
    </div>}
    {species && <PokemonMisc species={species} />}
  </div>;
}