import { getTypeIconById } from "@/components/[id]/details/types";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { capitilize, getIdFromUrlSubstring } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import Link from "next/link";
import { IMove } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";


export default function MoveDataTable({ moveData }: { moveData: IMove }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();


  return settings && <div className="move-data mt-2 w-full">
    <h3 className="w-fit text-lg mb-4">{t('moves.moveData.title')}</h3>
    <table className="w-full" aria-label="Move data table">
      <tbody>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.type')}</th>
          <td className="py-1">
            <Link href={`/type/${moveData.type.name}`}>
              <Image
                loading="lazy"
                width="100"
                height="20"
                alt={moveData.type.name}
                src={getTypeIconById(getIdFromUrlSubstring(moveData.type.url), settings.typeArtworkUrl)}
              />
            </Link>
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