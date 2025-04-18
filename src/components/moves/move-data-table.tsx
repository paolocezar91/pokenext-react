import Image from "next/image";
import { IMove } from "pokeapi-typescript";
import { getTypeIconById } from "@/components/[id]/details/types";
import { getIdFromUrlSubstring } from "@/components/shared/utils";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useTranslation } from "react-i18next";

interface MoveDataTableProps {
  moveData: IMove;
}

export default function MoveDataTable({ moveData }: MoveDataTableProps) {
  const { t } = useTranslation('common');

  return (
    <div className="move-data mt-2 w-full">
      <h3 className="text-lg mb-4">Move Data</h3>
      <table className="w-full">
        <tbody>
          <tr>
            <th className="text-left">{t('pokedex.details.moves.type')}</th>
            <td className="py-1">
              <Image
                width="100"
                height="20"
                alt={moveData.type.name}
                src={getTypeIconById(getIdFromUrlSubstring(moveData.type.url))}
              />
            </td>
          </tr>
          <tr>
            <th className="text-left">{t('pokedex.details.moves.class')}</th>
            <td className="py-1">
              <span className="flex">
                <Tooltip content={moveData.damage_class.name}>
                  <Image
                    width="35"
                    height="35"
                    alt={moveData.damage_class.name}
                    src={`/move-${moveData.damage_class.name}.png`}
                  />
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
    </div>
  );
}