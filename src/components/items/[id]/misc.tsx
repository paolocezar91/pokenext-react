import SkeletonBlock from "@/components/shared/skeleton-block";
import {
  capitilize,
  kebabToSpace,
  normalizeGeneration,
} from "@/components/shared/utils";
import { useTranslations } from "next-intl";
import { IItem } from "pokeapi-typescript";

function ItemMiscSkeleton() {
  const t = useTranslations();

  return (
    <>
      {[["Category"], ["Cost"], ["Attributes"]].map(([title]) => {
        return (
          <div className="pokemon-misc" key={title}>
            <h3 className="w-fit text-lg font-semibold mb-2">{title}</h3>
            <SkeletonBlock className="mt-1.5" />
          </div>
        );
      })}
    </>
  );
}

export default function ItemMisc({ item }: { item: IItem | null }) {
  const t = useTranslations();
  if (!item) {
    return <ItemMiscSkeleton />;
  }

  const normalize = (text: string) => {
    return capitilize(kebabToSpace(text));
  };

  const flingEffect = item.fling_effect?.name;
  const flingPower = item.fling_power;

  return (
    <>
      {[
        [
          "Generations",
          item.game_indices
            .map((g) => normalizeGeneration(g.generation.name))
            .join(", "),
        ],
        [t("items.cost"), item.cost ? `${item.cost} $` : "N/A"],
        [t("items.category"), normalize(item.category.name)],
        [
          t("items.attributes"),
          item.attributes.map((a) => normalize(a.name)).join(", "),
        ],
        [t("items.flingEffect"), flingEffect ? normalize(flingEffect) : "N/A"],
        [t("items.flingPower"), flingPower ?? "N/A"],
      ].map(([title, value]) => {
        return (
          <div className="pokemon-misc" key={title}>
            <h3 className="w-fit text-lg font-semibold mb-2">{title}</h3>
            {value}
          </div>
        );
      })}
    </>
  );
}
