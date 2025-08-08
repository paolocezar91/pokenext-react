import { normalizeVersionGroup } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IMove } from "pokeapi-typescript";
import { memo, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SkeletonBlock from "../shared/skeleton-block";

export default memo(function FlavorText({ moveData }: { moveData: IMove }) {
  console.log(`flavor-text`, moveData, new Date().toLocaleTimeString());

  const [flavorIdx, setFlavorIdx] = useState(0);
  const { t } = useTranslation('common');
  const { settings } = useUser();


  const renderFlavorText = () => {
    if(!settings || !moveData) {
      return <SkeletonBlock />;
    }

    const getFlavors = () => moveData.flavor_text_entries.filter(entry => entry.language.name === settings?.descriptionLang);
    if(getFlavors().length === 0) {
      return <p> {t('moves.flavorText.empty')} </p>;
    }

    return <>
      <p>{getFlavors()[flavorIdx]?.flavor_text}</p>
      <div className="flex">
        <Button
          data-testid="previous-button"
          aria-label={`${t('actions.previous')} flavor text`}
          onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
          disabled={flavorIdx === 0}
          className="text-xs mr-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600 transition-colors"
        >
          <ChevronLeftIcon className="w-5" />
        </Button>
        <Button
          data-testid="next-button"
          aria-label={`${t('actions.next')} flavor text`}
          onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
          disabled={getFlavors().length - 1 === flavorIdx}
          className="text-xs ml-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600 transition-colors"
        >
          <ChevronRightIcon className="w-5" />
        </Button>
      </div>
      <div className="absolute bottom-[-8px] right-0 border-t-1 border-t-white text-sm">
        <small className="mr-2">({normalizeVersionGroup(getFlavors()[flavorIdx].version_group.name)})</small>
        {flavorIdx + 1} / {getFlavors().length}
      </div>
    </>;

  };

  return (
    <div className="flavor w-full mt-2">
      <h3 className="w-fit text-lg mb-4">{t('moves.flavorText.title')}</h3>
      <div className="flex items-end relative items-start justify-between pb-6">
        {renderFlavorText()}
      </div>
    </div>
  );
}, (prev, next) => {
  return prev.moveData.id === next.moveData.id;
});