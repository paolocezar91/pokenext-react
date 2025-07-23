import PokeApiQuery from "@/app/poke-api-query";
import Table from "@/components/shared/table/table";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import { capitilize, getIdFromUrlSubstring, normalizePokemonName, useAsyncQuery } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IPkmn } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { ITypePokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import { getTypeIconById } from "../[id]/details/types";
import LoadingSpinner from "../shared/spinner";
import { useState } from "react";
import { SortingDir, sortResources, updateSortKeys } from "../shared/table/sorting";
import SortButton from "../shared/table/sort-button";
import { useSnackbar } from "@/context/snackbar";
export type SortKey = 'id' | 'name' | 'types';
const pokeApiQuery = new PokeApiQuery();

export default function PokemonByType({ pokemonList, type }: { pokemonList: ITypePokemon[], type: string }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();
  const [sorting, setSorting] = useState<SortingDir<SortKey>[]>([]);
  const { showSnackbar } = useSnackbar();
  const toggleSort = (key: SortKey) => {
    setSorting(prev => updateSortKeys(prev, key));
  };

  const ids = pokemonList
    .map(p => Number(getIdFromUrlSubstring(p.pokemon.url)))
    .filter(id => id <= 1025);

  const { data: pokemonByType, error } = useAsyncQuery(
    () => pokeApiQuery.getPokemonByIds(ids),
    [pokemonList],
    (e) => showSnackbar(e, 5)
  );

  if(!pokemonByType?.results.length) {
    if (error) {
      return <div className="h-[-webkit-fill-available] w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
        <h3 className="w-fit text-lg mb-4">{t('type.pokemon.title', { type: capitilize(type), length: "ERROR" })}</h3>
      </div>;
    }
    return <LoadingSpinner />;
  }

  const tableHeaders = <>
    <th className="bg-(--pokedex-red-dark) w-[5%]"></th>
    <th className="bg-(--pokedex-red-dark) w-[1%] text-white text-center px-2 py-1">
      <SortButton attr="id" onClick={() => toggleSort("id")} sorting={sorting}>#</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[20%] text-white text-left px-2 py-1">
      <SortButton attr="name" onClick={() => toggleSort("name")} sorting={sorting}>{t('table.name')}</SortButton>
    </th>
    <th className="bg-(--pokedex-red-dark) w-[10%] text-white text-left px-2 py-1">
      <SortButton attr="types" onClick={() => toggleSort("types")} sorting={sorting}>{t('table.types')}</SortButton>
    </th>
  </>;

  const typesCell = (pokemon: IPkmn) => <td className="p-2">
    {pokemon.types.map((t, idx) =>
      <Link href={`/type/${t.type.name}`} key={idx}>
        <Image
          width="100"
          height="20"
          className="inline m-1"
          alt={capitilize(t.type.name)}
          src={getTypeIconById(getIdFromUrlSubstring(t.type.url), settings!.typeArtworkUrl)} />
      </Link>
    )}
  </td>;

  // eslint-disable-next-line no-unused-vars
  const sortMapping: (a: IPkmn, b: IPkmn) => Record<SortKey, [number | string, number | string]> = (a,b) => ({
    'id': [a.id, b.id],
    'name': [a.name, b.name],
    'types': [a.types.map(t => t.type.name).join(","), b.types.map(t => t.type.name).join(",")],
  });

  const sortedPokemon = pokemonByType.results
    .sort(sortResources(sorting, sortMapping, 'id'));

  const tableBody = sortedPokemon
    .map((pokemon, idx, self) => {
      const isLast = idx === self.length - 1;
      return (
        <tr key={idx} className={`${!isLast ? 'border-solid border-foreground  border-b-2' : ''}`}>
          <td className="p-2">
            <Link href={`/pokedex/${pokemon.name}`} >
              <PokemonThumb pokemonData={pokemon} size="xs" />
            </Link>
          </td>
          <td className="p-2 text-center">
            {getNumber(Number(pokemon.id))}
          </td>
          <td className="p-2">
            <Link className="transition-colors hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`} >
              {normalizePokemonName(pokemon.name)}
            </Link>
          </td>
          {typesCell(pokemon)}
        </tr>
      );
    });

  return (
    <div className="h-[-webkit-fill-available] w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4">{t('type.pokemon.title', { type: capitilize(type), length: pokemonByType.results.length })}</h3>
      {!!pokemonByType.results.length &&
      <div className="h-[-webkit-fill-available] sm:overflow-initial md:overflow-auto">
        <Table headers={tableHeaders}>{tableBody}</Table>
      </div>
      }
    </div>
  );
}