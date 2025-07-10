import Link from "next/link";
import { INamedApiResource, IPokemon } from "pokeapi-typescript";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import { getIdFromUrlSubstring, normalizePokemonName } from "@/components/shared/utils";
import { useTranslation } from "react-i18next";
import Table from "@/components/shared/table";

export default function PokemonByType({ pokemonList }: { pokemonList: INamedApiResource<IPokemon>[] }) {
  const { t } = useTranslation('common');

  const headers = ["#", t('table.name', "")].map((header, idx) =>
    <th
      key={idx}
      className={
        idx === 0
          ? "w-[0%] text-white text-center px-2 py-2"
          : "w-[95%] text-white text-left px-2 py-2"
      }
    >
      {header}
    </th>
  );
  const body = pokemonList
    .filter((pokemon) => Number(getIdFromUrlSubstring(pokemon.url)) < 1025)
    .map((pokemon, idx) => {
      const isLast = idx === pokemonList.length - 1;
      return (
        <tr key={idx} className={`${!isLast ? 'border-solid border-foreground  border-b-2' : ''}`}>
          <td className="p-2">
            {getNumber(Number(getIdFromUrlSubstring(pokemon.url)))}
          </td>
          <td className="p-2">
            <Link className="hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`} >
              {normalizePokemonName(pokemon.name)}
            </Link>
          </td>
          <td className="p-2">
            <Link href={`/pokedex/${pokemon.name}`} >
              <PokemonThumb pokemonDataSmall={pokemon} size="xs" />
            </Link>
          </td>
        </tr>
      );
    });

  return (
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="w-fit text-lg mb-4"> {t('type.pokemon.title', { length: pokemonList?.length })}</h3>
      {!!pokemonList?.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <Table headers={headers}>{body}</Table>
      </div>
      }
    </div>
  );
}