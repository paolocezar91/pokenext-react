import { TypeLocale } from "@/components/layout/descriptionLang";
import { capitilize, kebabToSpace, normalizePokemonName, normalizeVersionGroup, useLocalStorage } from "@/components/shared/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IPokemon, IPokemonSpecies } from "pokeapi-typescript";
import { useState } from "react";
import { Button } from "react-bootstrap";


export default function PokemonDescription({ pokemon, species }: { pokemon: IPokemon, species: IPokemonSpecies }) {
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

  console.log(species);


  return <div className="pokemon-description col-span-2 capitilize">
    <h2 className="text-xl font-semibold mb-4 ">
      <span>
        { normalizePokemonName(species.name) } -- {species.genera.find(g => g.language.name === descriptionLang)?.genus}
      </span>
    </h2>
    <div className="flex items-end relative pb-6">
      <p>{getFlavorText(species)[flavorIdx].flavor_text}</p>
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
      <div className="absolute bottom-0 right-0">
        <small className="mr-2">({ capitilize(kebabToSpace(getFlavorText(species)[flavorIdx].version_group_name)) })</small>
        {flavorIdx + 1} / {getFlavorText(species).length}
      </div>
    </div>
    {pokemon.game_indices.length !== 0 && <>
      <h3 className="text-base">First Appeareance</h3>
      <p>{normalizeVersionGroup(`${pokemon.game_indices[0].version.name}-${pokemon.game_indices[1].version.name}`)}</p>
    </>}
  </div>;
}