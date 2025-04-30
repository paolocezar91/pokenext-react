import { IPkmn } from '@/app/types';
import Select from '@/components/shared/select';
import Toggle from '@/components/shared/toggle';
import { capitilize, getIdFromUrlSubstring, normalizePokemonName, useLocalStorage } from '@/components/shared/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { statName } from '../../[id]/details/stats';
import { getTypeIconById, TypeUrl } from '../../[id]/details/types';
import PokemonThumb, { getNumber } from '../../shared/thumb/thumb';
import { Settings } from '../settings/settings';
import Tooltip from '@/components/shared/tooltip/tooltip';

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const [showThumb, setShowThumb] = useLocalStorage('showThumbTable', true);
  const [thumbSize, setThumbSize] = useLocalStorage('thumbSizeTable', 'xs');
  const [typeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', 'sword-shield');
  const { t } = useTranslation('common');

  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setThumbSize(e.target.value);
  };

  const handleShowThumb = (showThumb: boolean) => {
    setShowThumb(showThumb);
  };

  return <div className="table-container p-4 bg-(--pokedex-red) relative">
    <Settings>
      <div className="settings-item mb-2">
        <label htmlFor="showThumb">
          <Toggle value={showThumb} id="showThumb" onChange={handleShowThumb}>
            {t('settings.showThumb')}
          </Toggle>
        </label>
      </div>
      {showThumb && <div className="settings-item">
        <label htmlFor="thumbSize">
          {t('settings.size.title')}
          <Select className="w-full" value={thumbSize} id="thumbSize" onChange={handleThumbSizeChange}>
            <option value="xs">{t('settings.size.xs')}</option>
            <option value="sm">{t('settings.size.sm')}</option>
          </Select>
        </label>
      </div>}
    </Settings>
    <div className="overflow-auto h-[72vh] relative rounded">
      <table className="w-full text-xs">
        <thead className="bg-(--pokedex-red)">
          <tr className="sticky top-0 bg-(--pokedex-red) z-1">
            {showThumb && <th className="w-[1%] text-white text-center px-2 py-2">Pokémon</th>}
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
        <tbody className="bg-background">
          { pokemons.map((pokemon, i) => {
            const isFirst = i === 0;
            const isLast = i === pokemons.length - 1;

            return <tr key={i} className="bg-background">
              {showThumb && <td className={`
                px-4
                ${isFirst ? 'pt-4' : ''}
                ${!showThumb ? 'py-4': 'py-2'}
              `}>
                <Link href={`/pokedex/${pokemon.name}`}>
                  <PokemonThumb pokemonData={pokemon} size={thumbSize} />
                </Link>
              </td>}
              <td className={`
                px-4
                ${isFirst ? 'pt-4' : ''}
                ${!isLast ? 'border-solid border-b-2 border-foreground text-center': ''} 
                ${!showThumb ? 'py-4': 'py-2'} 
              `}>
                <Link href={`/pokedex/${pokemon.name}`}>
                  {getNumber(pokemon.id)}
                </Link>
              </td>
              <td className={`
                px-4 
                ${isFirst ? 'pt-4' : ''}
                ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
                ${!showThumb ? 'py-4': 'py-2'} 
              `}>
                <Tooltip className="!p-2 !rounded-xl" content={<PokemonThumb pokemonData={pokemon} size={thumbSize} />}>
                  <Link className="text-bold" href={`/pokedex/${pokemon.name}`}>
                    {normalizePokemonName(pokemon.name)}
                  </Link>
                </Tooltip>
              </td>
              <td className={`
                px-4
                ${!isLast ? 'border-solid border-b-2 border-foreground': ''}
                ${!showThumb ? 'py-4': 'py-2'}
                ${isFirst ? 'pt-4' : ''}
              `}>
                {pokemon.types.map((t, idx) =>
                  <Image
                    key={idx}
                    width="100"
                    height="20"
                    className="inline m-1"
                    alt={capitilize(t.type.name)}
                    src={getTypeIconById(getIdFromUrlSubstring(t.type.url), typeArtworkUrl)} />
                )}
              </td>
              { pokemon.stats.map((stat, idx) => {
                return <td
                  key={idx}
                  className={`
                    px-4
                    ${isFirst ? 'pt-4' : ''}
                    ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
                    ${!showThumb ? 'py-4': 'py-2'}
                  `}
                >
                  { stat.base_stat }
                </td>;
              }) }
              <td></td>
            </tr>;
          }) }
        </tbody>
        <tfoot className="bg-background">
          <tr>
            <td className="py-2" colSpan={showThumb ? 11 : 10}>{ children }</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>;
}