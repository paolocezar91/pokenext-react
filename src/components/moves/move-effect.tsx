import { useUser } from "@/context/user-context";
import { Move } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import SkeletonBlock from "../shared/skeleton-block";

export default function MoveEffect({ moveData }: { moveData: Move }) {
  const t = useTranslations();
  const { settings } = useUser();

  const getEffects = () => {
    return moveData.effect_entries.filter(
      (effect) => effect.language.name === settings?.descriptionLang
    );
  };

  const renderEffect = () => {
    if (!settings || !moveData) {
      return <SkeletonBlock />;
    }

    if (getEffects().length === 0) {
      return <p>{t("moves.moveEffect.empty")}</p>;
    }

    return <p>{getEffects()[0].effect}</p>;
  };

  return (
    <div className="effect flex flex-col max-h-50 w-full">
      <h3 className="w-fit text-lg mb-4">{t("moves.moveEffect.title")}</h3>
      <div className="flex-1 py-1 h-[-webkit-fill-available] overflow-auto">
        {renderEffect()}
      </div>
    </div>
  );
}
