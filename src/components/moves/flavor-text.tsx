import { capitilize, kebabToSpace, normalizeVersionGroup } from "@/pages/pokedex/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IMove } from "pokeapi-typescript";
import { useState } from "react";

interface FlavorTextProps {
  moveData: IMove;
}

export default function FlavorText({ moveData }: FlavorTextProps) {
  const [flavorIdx, setFlavorIdx] = useState(0);

  const getFlavors = () => {
    return moveData.flavor_text_entries.filter(entry => entry.language.name === 'en');
  };

  return (
    <div className="flavor w-full">
      <h3 className="text-xl font-semibold mb-4">{capitilize(kebabToSpace(moveData.name))}</h3>
      <div className="flex items-end relative pb-8">
        <p>{getFlavors()[flavorIdx]?.flavor_text}</p>
        <div className="flex">
          <button
            onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
            disabled={flavorIdx === 0}
            className="text-xs mr-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
          >
            <ChevronLeftIcon className="w-5" />
          </button>
          <button
            onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
            disabled={getFlavors().length - 1 === flavorIdx}
            className="text-xs ml-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
          >
            <ChevronRightIcon className="w-5" />
          </button>
        </div>
        <div className="absolute bottom-0 right-0">
          <small className="mr-2">({normalizeVersionGroup(getFlavors()[flavorIdx].version_group.name)})</small>
          {flavorIdx + 1} / {getFlavors().length}
        </div>
      </div>
    </div>
  );
}