import Table from "@/components/shared/table";
import { getNumber } from "@/components/shared/thumb/thumb";
import { capitilize, getIdFromUrlSubstring, kebabToSpace, normalizePokemonName } from "@/components/shared/utils";
import Link from "next/link";
import { IMove, INamedApiResource } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function MoveByType({ movesList }: { movesList: INamedApiResource<IMove> }) {
  const { t } = useTranslation('common');

  const headers = ["#", t('table.name')].map((header, idx) =>
    <th
      key={idx}
      className={
        idx === 0
          ? "w-[0%] text-white text-center px-2 py-2"
          : "w-[5%] text-white text-left px-2 py-2"
      }
    >
      {header}
    </th>
  );
  const body = movesList
    .filter((_, idx) => idx < 100)
    .map((move, idx) => {
      const isLast = idx === movesList.length - 1;
      return (
        <tr key={idx} className={`${!isLast ? 'border-solid border-foreground  border-b-2' : ''}`}>
          <td className="p-2">
            {getNumber(Number(getIdFromUrlSubstring(move.url)))}
          </td>
          <td className="p-2">
            <Link className="hover:bg-(--pokedex-red-dark) p-1" href={`/moves/${move.name}`} >
              {capitilize(kebabToSpace(move.name))}
            </Link>
          </td>
        </tr>
      );
    });

  return (
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4">{t('type.moves.title', { length: movesList?.length })}</h3>
      {!!movesList?.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <Table headers={headers}>{body}</Table>
      </div>
      }
    </div>
  );
}