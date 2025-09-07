import { getTypeIconById } from "@/components/pokedex/[id]/details/types";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { capitilize, getIdFromUrlSubstring } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import Link from "@/components/shared/link";
import { IMove } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import SkeletonBlock from "../shared/skeleton-block";


export default function MoveDataTable({ moveData }: { moveData: IMove }) {
  const t = useTranslations();
  const { settings } = useUser();

  return <div className="move-data mt-2 w-full">
    <h3 className="w-fit text-lg mb-4">{t('moves.moveData.title')}</h3>
    <table className="w-full">
      <tbody>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.type')}</th>
          <td className="py-1">
            {settings ?
              <Link href={`/type/${moveData.type.name}`}>
                <Image
                  loading="lazy"
                  width="100"
                  height="20"
                  alt={moveData.type.name}
                  src={getTypeIconById(getIdFromUrlSubstring(moveData.type.url), settings.typeArtworkUrl)}
                />
              </Link> :
              <SkeletonBlock className="w-45" />}
          </td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.class')}</th>
          <td className="py-1">
            { settings ?
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
              </Tooltip> :
              <SkeletonBlock />}
          </td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.power')}</th>
          <td className="py-1 w-50">{settings ? moveData.power ?? '-' : <SkeletonBlock className="w-50" />}</td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.accuracy')}</th>
          <td className="py-1 w-50">{settings ? moveData.accuracy ?? '-': <SkeletonBlock className="w-45" />}</td>
        </tr>
        <tr>
          <th className="text-left">{t('pokedex.details.moves.pp')}</th>
          <td className="py-1 w-50">{settings ? moveData.pp ?? '-': <SkeletonBlock className="w-40" />}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}