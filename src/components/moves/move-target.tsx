import { useUser } from "@/context/UserContext";
import { IMoveTarget } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function MoveTarget({ targetData }: {
  targetData: IMoveTarget;
}) {
  const { t } = useTranslation('common');
  const { settings } = useUser();

  const description = targetData.descriptions.find((d) => d.language.name === settings?.descriptionLang)?.description || '';

  return (
    <div className="target w-full mt-2">
      <h3 className="w-fit text-lg font-semibold mb-2">{t('moves.moveTarget.title')}</h3>
      {!description ?
        <p data-testid="target-description">{t('moves.moveTarget.empty')}</p>:
        <p data-testid="target-description">{description}</p>
      }
    </div>
  );
}