import SkeletonBlock from "@/components/shared/skeleton-block";
import { useUser } from "@/context/user-context";
import { Item } from "pokeapi-typescript";
import { useCallback } from "react";

export default function ItemDescription({ item }: { item: Item }) {
  const { settings } = useUser();

  const renderFlavorText = useCallback(() => {
    if (!item || !settings) {
      return (
        <div className="pokemon-description col-span-6 capitilize">
          <SkeletonBlock className="w-full mb-1" />
          <SkeletonBlock className="w-4/5 mb-1" />
        </div>
      );
    }

    const short_effect = item.effect_entries?.[0]?.short_effect ?? "";
    const effect = item.effect_entries?.[0]?.effect ?? "";

    return (
      <div className="flex flex-col items-start pb-6">
        {short_effect !== effect &&
          <div className="flex mb-2 ">{short_effect}</div>
        }
        <div className="flex">{effect}</div>
      </div>
    );
  }, [item, settings]);

  return (
    <div className="item-description col-span-6 capitilize">
      {renderFlavorText()}
    </div>
  );
}
