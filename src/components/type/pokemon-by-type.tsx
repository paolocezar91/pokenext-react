import Link from "next/link";
import { INamedApiResource, IPokemon } from "pokeapi-typescript";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from "@/components/shared/utils";
import { useTranslation } from "react-i18next";
import Table from "@/components/shared/table";
import { useEffect, useState } from "react";
import PokeApiQuery from "@/app/poke-api-query";
import { IPkmn } from "@/types/types";
import Image from "next/image";
import { getTypeIconById } from "../[id]/details/types";
import { useUser } from "@/context/user-context";
const pokeApiQuery = new PokeApiQuery();

export default function PokemonByType({ pokemonList, type }: { pokemonList: INamedApiResource<IPokemon>[], type: string }) {
  const { t } = useTranslation('common');
  const [pokemonByType, setPokemonByType] = useState<IPkmn[]>([]);
  const { settings } = useUser();

  useEffect(() => {
    const ids = pokemonList.map(p => Number(getIdFromUrlSubstring(p.url)));
    pokeApiQuery.getPokemonByIds(ids)
      .then((res) => setPokemonByType(res.results));
  }, [pokemonList]);

  const tableHeaders = <>
    <th className="w-[5%]"></th>
    <th className="w-[1%] text-white text-center px-2 py-2">#</th>
    <th className="w-[50%] text-white text-left px-2 py-2">{t('table.name')}</th>
    <th className="w-[5%]text-white text-left px-2 py-2">{t('table.types')}</th>
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


  const tableBody = pokemonByType
    .map((pokemon, idx) => {
      const isLast = idx === pokemonList.length - 1;
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
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4">{t('type.pokemon.title', { type: capitilize(type), length: pokemonList?.length })}</h3>
      {!!pokemonList?.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <Table headers={tableHeaders}>{tableBody}</Table>
      </div>
      }
    </div>
  );
}