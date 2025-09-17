import { useUser } from "@/context/user-context";
import { IMoveTarget } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import SkeletonBlock from "../shared/skeleton-block";

export default function MoveTarget({
  targetData,
}: {
  targetData: IMoveTarget | null;
}) {
  const t = useTranslations();
  const { settings } = useUser();

  const renderTarget = () => {
    if (!targetData) {
      return <SkeletonBlock />;
    }

    const description =
      targetData.descriptions.find(
        (d) => d.language.name === settings?.descriptionLang,
      )?.description || "";
    if (!description) {
      return (
        <p data-testid="target-description">{t("moves.moveTarget.empty")}</p>
      );
    }

    return <p data-testid="target-description">{description}</p>;
  };

  return (
    <div className="target w-full mt-2">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("moves.moveTarget.title")}
      </h3>
      {renderTarget()}
    </div>
  );
}
