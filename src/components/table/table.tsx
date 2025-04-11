import { IPkmn } from '@/app/types';
import { capitilize } from '@/pages/pokedex/[id]';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import PokemonThumb, { getNumber } from '../thumb/thumb';
import "./table.scss";

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const { t } = useTranslation('common');

  return (
    <div className="table-container p-4 rounded-b-lg pt-0">
      <table className="w-full">
        <thead>
          <tr className="border-solid border-(--pokedex-red-light) border-b-2 sticky top-0 bg-(--pokedex-red) z-1">
            <th className="text-center px-4 py-4 w-[15%]">Pokémon</th>
            <th className="text-center px-4 py-4 w-[7%]">#</th>
            <th className="text-left px-4 py-4 w-[50%]">{t('table.name')}</th>
            <th className="text-left px-4 py-4">{t('table.types')}</th>
          </tr>
        </thead>
        <tbody>
          {
            pokemons.map((pokemon, i) => {
              return <tr key={i}>
                <td className={`px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}><Link href={`/pokedex/${pokemon.name}`}><PokemonThumb pokemonData={pokemon} size="tiny" title={false} /></Link></td>
                <td className={`border-solid border-b-2 border-(--pokedex-red-light) px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}><Link className="underline" href={`/pokedex/${pokemon.name}`}>#{getNumber(pokemon.id)}</Link></td>
                <td className={`border-solid border-b-2 border-(--pokedex-red-light) px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}><Link className="underline text-bold" href={`/pokedex/${pokemon.name}`}>{capitilize(pokemon.name)}</Link></td>
                <td className={`border-solid border-b-2 border-(--pokedex-red-light) px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}>{(pokemon.types.map((t) => capitilize(t.type.name)).join("/"))}</td>
              </tr>;
            })
          }
          <tr>
            <td className="py-2" colSpan={4}>{ children }</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}