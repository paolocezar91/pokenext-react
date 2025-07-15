import PokeApiQuery from "@/app/query";
import Table from "@/components/shared/table";
import { capitilize, getIdFromUrlSubstring, kebabToSpace } from "@/components/shared/utils";
import Image from "next/image";
import Link from "next/link";
import { IMove, INamedApiResource } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "../shared/tooltip/tooltip";
const pokeApiQuery = new PokeApiQuery();

export default function MovesByType(
  { movesList, type }: { movesList: INamedApiResource<IMove>[], type: string }) {
  const { t } = useTranslation('common');
  const [movesMany, setMovesMany] = useState<any[]>([]);

  useEffect(() => {
    const ids = movesList.map(p => Number(getIdFromUrlSubstring(p.url)));
    pokeApiQuery.getManyMoves(ids).then((res) => {
      setMovesMany(res);
    });
  }, [movesList]);

  const tableHeaders = <>
    <th className="w-[50%] text-white text-left px-2 py-2">{t('table.name')}</th>
    <th className="w-[5%]text-white text-center px-2 py-2">{t('pokedex.details.moves.class')}</th>
    <th className="w-[5%]text-white text-center px-2 py-2">{t('pokedex.details.moves.power')}</th>
    <th className="w-[5%]text-white text-center px-2 py-2">{t('pokedex.details.moves.pp')}</th>
    <th className="w-[5%]text-white text-center px-2 py-2">{t('pokedex.details.moves.accuracy')}</th>
  </>;

  const tableBody = movesMany
    .filter((_, idx) => idx < 100)
    .map((move, idx) => {
      const isLast = idx === movesMany.length - 1;
      return (
        <tr key={idx} className={`${!isLast ? 'border-solid border-foreground  border-b-2' : ''}`}>
          <td className="p-1">
            <Link className="transition-colors transition-colors hover:bg-(--pokedex-red-dark) p-1" href={`/moves/${move.name}`} >
              {capitilize(kebabToSpace(move.name))}
            </Link>
          </td>
          <td className="p-1 text-center">
            <Tooltip content={capitilize(move.damage_class.name)}>
              <span className="flex items-center">
                <Image
                  loading="lazy"
                  width="35"
                  height="35"
                  alt={`${move.damage_class.name}`}
                  src={`/move-${move.damage_class.name}.png`}
                  className="mr-2"
                />
              </span>
            </Tooltip>
          </td>
          <td className="p-1 text-center">
            {(move.power)}
          </td>
          <td className="p-1 text-center">
            {(move.pp)}
          </td>
          <td className="p-1 text-center">
            {(move.accuracy)}
          </td>
        </tr>
      );
    });

  return (
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4">{t('type.moves.title', { type: capitilize(type), length: movesMany?.length })}</h3>
      {!!movesMany?.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <Table headers={tableHeaders}>{tableBody}</Table>
      </div>
      }
    </div>
  );
}