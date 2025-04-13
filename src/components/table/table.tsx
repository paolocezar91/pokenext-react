import { IPkmn } from '@/app/types';
import { capitilize, normalizePokemonName } from '@/pages/pokedex/utils';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import PokemonThumb, { getNumber } from '../thumb/thumb';

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const { t } = useTranslation('common');

  return (
    <div className="table-container p-4 bg-(--pokedex-red)">
      <div className="overflow-auto h-[68vh] relative rounded">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 bg-(--pokedex-red) z-1">
              <th className="text-center px-4 py-4 w-[10%]">Pokémon</th>
              <th className="text-center px-4 py-4 w-[7%]">#</th>
              <th className="text-left px-4 py-4 w-[50%]">{t('table.name')}</th>
              <th className="text-left px-4 py-4">{t('table.types')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              pokemons.map((pokemon, i) => {
                return <tr key={i} className="bg-background">
                  <td className={`px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                    <Link href={`/pokedex/${pokemon.name}`}>
                      <PokemonThumb pokemonData={pokemon} size="xs" title={false} />
                    </Link>
                  </td>
                  <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-white': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                    <Link href={`/pokedex/${pokemon.name}`}>
                    #{getNumber(pokemon.id)}
                    </Link>
                  </td>
                  <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-white': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                    <Link className="text-bold" href={`/pokedex/${pokemon.name}`}>
                      {normalizePokemonName(pokemon.name)}
                    </Link>
                  </td>
                  <td className={`${i < pokemons.length - 1 ? 'border-solid border-b-2 border-white': ''} px-4 py-1 ${i===0 ? 'pt-4' : ''}`}>
                    {(pokemon.types.map((t) => capitilize(t.type.name)).join("/"))}</td>
                </tr>;
              })
            }
            <tr>
              <td className="py-2" colSpan={4}>{ children }</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}