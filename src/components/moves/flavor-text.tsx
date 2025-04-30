import { capitilize, kebabToSpace, normalizeVersionGroup, useLocalStorage } from "@/components/shared/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IMove } from "pokeapi-typescript";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TypeLocale } from "../layout/descriptionLang";

export default function FlavorText({ moveData }: { moveData: IMove }) {
  const [flavorIdx, setFlavorIdx] = useState(0);
  const { t } = useTranslation('common');
  const [descriptionLang] = useLocalStorage<TypeLocale>('descriptionLang', 'en');


  const getFlavors = () => {
    return moveData.flavor_text_entries.filter(entry => entry.language.name === descriptionLang);
  };

  return (
    <div className="flavor w-full">
      <h3 className="text-xl font-semibold mb-4">{capitilize(kebabToSpace(moveData.name))}</h3>
      <div className="flex items-end relative items-start justify-between pb-6">
        {getFlavors().length === 0 ?
          <p> {t('moves.flavorText.empty')} </p>
          : <>
            <p>{getFlavors()[flavorIdx]?.flavor_text}</p>
            <div className="flex">
              <Button
                data-testid="previous-button"
                aria-label={`${t('actions.previous')} flavor text`}
                onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
                disabled={flavorIdx === 0}
                className="text-xs mr-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
              >
                <ChevronLeftIcon className="w-5" />
              </Button>
              <Button
                data-testid="next-button"
                aria-label={`${t('actions.next')} flavor text`}
                onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
                disabled={getFlavors().length - 1 === flavorIdx}
                className="text-xs ml-1 h-5 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
              >
                <ChevronRightIcon className="w-5" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-0">
              <small className="mr-2">({normalizeVersionGroup(getFlavors()[flavorIdx].version_group.name)})</small>
              {flavorIdx + 1} / {getFlavors().length}
            </div>
          </>
        }
      </div>
    </div>
  );
}