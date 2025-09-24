import SkeletonBlock from "@/components/shared/skeleton-block";
import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Item } from "pokeapi-typescript";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function ItemFlavorText({ item }: { item: Item }) {
  const [flavorIdx, setFlavorIdx] = useState(0);
  const { settings } = useUser();

  const getFlavorText = (item: Item) => {
    return item?.flavor_text_entries
      .filter((text) => text.language.name === settings?.descriptionLang)
      .map((flavor) => {
        return {
          flavor_text: flavor.text,
          version_group_name: flavor.version_group.name,
        };
      });
  };

  const flavorTexts = getFlavorText(item);

  const renderFlavorText = () => {
    if (!item || !settings || !flavorTexts.length) {
      return (
        <div className="pokemon-description col-span-6 capitilize">
          <SkeletonBlock className="w-full mb-1" />
          <SkeletonBlock className="w-4/5 mb-1" />
        </div>
      );
    }

    return (
      <div className="flex items-end relative justify-between items-start pb-6">
        <div className="flex">{flavorTexts[flavorIdx].flavor_text}</div>
        <div className="flex">
          <Button
            onClick={() => setFlavorIdx((flavorIdx) => flavorIdx - 1)}
            disabled={flavorIdx === 0}
            className="text-xs mr-1 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600 transition-colors"
          >
            <ChevronLeftIcon className="w-5" />
          </Button>
          <Button
            onClick={() => setFlavorIdx((flavorIdx) => flavorIdx + 1)}
            disabled={flavorTexts.length - 1 === flavorIdx}
            className="text-xs ml-1 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600 transition-colors"
          >
            <ChevronRightIcon className="w-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 border-t-1 border-t-white text-xs">
          <small className="mr-2">
            {capitilize(
              kebabToSpace(flavorTexts[flavorIdx].version_group_name)
            )}
          </small>
          {flavorIdx + 1} / {flavorTexts.length}
        </div>
      </div>
    );
  };

  return (
    <div className="item-description col-span-6 capitilize">
      {renderFlavorText()}
    </div>
  );
}
