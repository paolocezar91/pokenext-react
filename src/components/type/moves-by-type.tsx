import PokeApiQuery from "@/app/api/poke-api-query";
import Table from "@/components/shared/table/table";
import { capitilize, getIdFromUrlSubstring, kebabToSpace } from "@/components/shared/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "@/components/shared/link";
import { IMove, INamedApiResource } from "pokeapi-typescript";
import { useState } from "react";
import { useTranslations } from "next-intl";
import SkeletonBlock from "../shared/skeleton-block";
import SortButton from "../shared/table/sort-button";
import { SortingDir, sortResources, updateSortKeys } from "../shared/table/sorting";
import Tooltip from "../shared/tooltip/tooltip";
const pokeApiQuery = new PokeApiQuery();
export type SortKey = 'id' | 'name' | 'class' | 'power' | 'pp' | 'accuracy';

export default function MovesByType({ movesList, type }: { movesList: INamedApiResource<IMove>[], type: string }) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingDir<SortKey>[]>([]);
  const toggleSort = (key: SortKey) => {
    setSorting(prev => updateSortKeys(prev, key));
  };

  const { data: movesByType } = useQuery({
    queryKey: ['movesList', movesList, type],
    queryFn: () => pokeApiQuery.getMovesByIds(movesList.map(p => Number(getIdFromUrlSubstring(p.url)))),
  });

  const tableHeaders = <>
    <th className="bg-(--pokedex-red-dark) w-[50%] text-white text-left px-2 py-1">
      <SortButton attr="name" onClick={() => toggleSort("name")} sorting={sorting}>{t('table.name')}</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[5%] px-2 py-1">
      <SortButton attr="class" onClick={() => toggleSort("class")} sorting={sorting}>{t('pokedex.details.moves.class')}</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[5%] px-2 py-1">
      <SortButton attr="power" onClick={() => toggleSort("power")} sorting={sorting}>{t('pokedex.details.moves.power')}</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[5%] px-2 py-1">
      <SortButton attr="pp" onClick={() => toggleSort("pp")} sorting={sorting}>{t('pokedex.details.moves.pp')}</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[5%] px-2 py-1">
      <SortButton attr="accuracy" onClick={() => toggleSort("accuracy")} sorting={sorting}>{t('pokedex.details.moves.accuracy')}</SortButton>
    </th>
  </>;

  // eslint-disable-next-line no-unused-vars
  const sortMapping: (a: IMove, b: IMove) => Record<SortKey, [number | string, number | string]> = (a,b) => ({
    'id': [a.id, b.id],
    'name': [a.name, b.name],
    'class': [a.damage_class.name, b.damage_class.name],
    'power': [a.power, b.power],
    'pp': [a.pp, b.pp],
    'accuracy': [a.accuracy, b.accuracy],
  });

  if(!movesByType?.results?.length) {
    const skeletonTableBody = [...Array(15)].map((_, i) => <tr key={i} className="border-solid border-foreground  border-b-2">
      {[...Array(5)].map((_, j) => <td key={j} className="p-2">
        <SkeletonBlock />
      </td>)}
    </tr>);
    return <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 h-[-webkit-fill-available]">
      <h3 className="w-fit text-lg mb-4">{t('type.moves.title', { type: capitilize(type), length: 0 })}</h3>
      <div className="h-[-webkit-fill-available]">
        <Table headers={tableHeaders}>{skeletonTableBody}</Table>
      </div>
    </div>;
  }

  const sortedMoves = movesByType.results
    .sort(sortResources(sorting, sortMapping, 'id'));

  const tableBody = sortedMoves
    .map((move, idx) => {
      const isLast = idx === movesByType!.results.length - 1;
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
            {(move.power ?? "-")}
          </td>
          <td className="p-1 text-center">
            {(move.pp)}
          </td>
          <td className="p-1 text-center">
            {(move.accuracy ?? "-")}
          </td>
        </tr>
      );
    });

  return <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 h-[-webkit-fill-available]">
    <h3 className="w-fit text-lg mb-4">{t('type.moves.title', { type: capitilize(type), length: movesByType.results.length })}</h3>
    <div className="h-[-webkit-fill-available]">
      <Table headers={tableHeaders}>{tableBody}</Table>
    </div>
  </div>
  ;
}