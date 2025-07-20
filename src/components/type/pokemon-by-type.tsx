import PokeApiQuery from "@/app/poke-api-query";
import Table from "@/components/shared/table";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import { capitilize, getIdFromUrlSubstring, normalizePokemonName, useAsyncQuery } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IPkmn } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { ITypePokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import { getTypeIconById } from "../[id]/details/types";
import { SpinnerIcon } from "../shared/spinner";
const pokeApiQuery = new PokeApiQuery();

export default function PokemonByType({ pokemonList, type }: { pokemonList: ITypePokemon[], type: string }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();
  const ids = pokemonList
    .map(p => Number(getIdFromUrlSubstring(p.pokemon.url)))
    .filter(id => id <= 1025);

  const { data: pokemonByType } = useAsyncQuery(
    () => pokeApiQuery.getPokemonByIds(ids),
    [pokemonList]
  );

  if(!pokemonByType?.results.length) {
    return <SpinnerIcon />;
  }

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

  const tableBody = pokemonByType.results
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
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4">{t('type.pokemon.title', { type: capitilize(type), length: pokemonByType.results.length })}</h3>
      {!!pokemonByType.results.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <Table headers={tableHeaders}>{tableBody}</Table>
      </div>
      }
    </div>
  );
}