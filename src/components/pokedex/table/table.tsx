import { IPkmn } from '@/app/types';
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from '@/pages/pokedex/utils';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import PokemonThumb, { getNumber } from '../../shared/thumb/thumb';
import { getTypeIconById } from '../../[id]/details/types';
import Image from 'next/image';
import { statName } from '../../[id]/details/stats';

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const { t } = useTranslation('common');

  return <div className="table-container p-4 bg-(--pokedex-red)">
    <div className="overflow-auto h-[68vh] relative rounded">
      <table className="w-full text-xs">
        <thead>
          <tr className="sticky top-0 bg-(--pokedex-red) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2">Pokémon</th>
            <th className="w-[2%] text-white text-center px-2 py-2">#</th>
            <th className="w-[5%] text-white text-left px-2 py-2">{t('table.name')}</th>
            <th className="w-[10%] text-white text-left px-2 py-2">{t('table.types')}</th>
            { !!pokemons.length && pokemons[0].stats.map((stat, idx) => {
              return <th
                key={idx}
                className="w-[5%] text-white text-left px-2 py-2"
              >
                { statName(stat.stat.name) }
              </th>;
            }) }
            <th className="w-[1%]"></th>
          </tr>
        </thead>
        <tbody>
          { pokemons.map((pokemon, i) => {
            return <tr key={i} className="bg-background">
              <td className={`px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                <Link href={`/pokedex/${pokemon.name}`}>
                  <PokemonThumb pokemonData={pokemon} size="xs" hasName={false} />
                </Link>
              </td>
              <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-foreground text-center': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                <Link href={`/pokedex/${pokemon.name}`}>
                    #{getNumber(pokemon.id)}
                </Link>
              </td>
              <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-foreground': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                <Link className="text-bold" href={`/pokedex/${pokemon.name}`}>
                  {normalizePokemonName(pokemon.name)}
                </Link>
              </td>
              <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-foreground': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                {pokemon.types.map((t, idx) =>
                  <Image
                    key={idx}
                    width="100"
                    height="20"
                    className={`${idx !== 0 || pokemon.types.length === 1 ? '' : 'mb-2'}`}
                    alt={capitilize(t.type.name)}
                    src={ getTypeIconById(getIdFromUrlSubstring(t.type.url) )} />
                )}
              </td>
              { pokemon.stats.map((stat, idx) => {
                return <td
                  key={idx}
                  className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-foreground': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}
                >
                  { stat.base_stat }
                </td>;
              }) }
              <td></td>
            </tr>;
          }) }
          <tr>
            <td className="py-2" colSpan={4}>{ children }</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
}