import { useUser } from "@/context/UserContext";
import { IMove } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function MoveEffect({ moveData }: { moveData: IMove; }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();

  const getEffects = () => {
    return moveData.effect_entries.filter(effect => effect.language.name === settings?.descriptionLang);
  };

  return (
    <div className="effect flex flex-col max-h-50 w-full">
      <h3 className="w-fit text-lg mb-4">{t('moves.moveEffect.title')}</h3>
      <div className="flex-1 py-1 h-[-webkit-fill-available] overflow-auto">
        { getEffects().length === 0 ?
          <p>{t('moves.moveEffect.empty')}</p>:
          <p>{getEffects()[0].effect}</p>
        }
      </div>
    </div>
  );
}