import Image from "next/image";
import { IMove } from "pokeapi-typescript";
import { getTypeIconById, TypeUrl } from "@/components/[id]/details/types";
import { capitilize, getIdFromUrlSubstring, useLocalStorage } from "@/components/shared/utils";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useTranslation } from "react-i18next";

interface MoveDataTableProps {
  moveData: IMove;
}

export default function MoveDataTable({ moveData }: MoveDataTableProps) {
  const { t } = useTranslation('common');
  const [typeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', 'sword-shield');


  return <div className="move-data mt-2 w-full">
    <h3 className="text-lg mb-4">{t('moves.moveData.title')}</h3>
    <table className="w-full" aria-label="Move data table">
      <tbody>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.type')}</th>
          <td className="py-1">
            <Image
              loading="lazy"
              width="100"
              height="20"
              alt={moveData.type.name}
              src={getTypeIconById(getIdFromUrlSubstring(moveData.type.url), typeArtworkUrl)}
            />
          </td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.class')}</th>
          <td className="py-1">
            <span className="flex">
              <Tooltip content={capitilize(moveData.damage_class.name)}>
                <span className="flex items-center">
                  <Image
                    loading="lazy"
                    width="35"
                    height="35"
                    alt={`${moveData.damage_class.name}`}
                    src={`/move-${moveData.damage_class.name}.png`}
                    className="mr-2"
                  />
                  {capitilize(moveData.damage_class.name)}
                </span>
              </Tooltip>
            </span>
          </td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.power')}</th>
          <td className="py-1">{moveData.power ?? '-'}</td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.accuracy')}</th>
          <td className="py-1">{moveData.accuracy ?? '-'}</td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.pp')}</th>
          <td className="py-1">{moveData.pp ?? '-'}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}