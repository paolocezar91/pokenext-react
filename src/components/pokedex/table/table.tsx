import { IPkmn } from '@/types/types';
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
import { Settings, SettingsItem } from '../settings/settings';
import Tooltip from '@/components/shared/tooltip/tooltip';

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const [showShowColumn, setShowShowColumn] = useLocalStorage('showShowColumn', false);
  const [showColumn, setShowColumn] = useLocalStorage('showColumn', [true, true, true, true, true, true, true, true, true]);
  const [showThumb, setShowThumb] = useLocalStorage('showThumbTable', true);
  const [thumbSize, setThumbSize] = useLocalStorage('thumbSizeTable', 'xs');
  const [typeArtworkUrl] = useLocalStorage<TypeUrl>('typeArtworkUrl', 'sword-shield');
  const { t } = useTranslation('common');

  const handleShowShowColumnChange = (value: boolean) => {
    setShowShowColumn(value);
  };

  const handleShowColumnChange = (value: boolean, idx: number) => {
    const _showColumn = [...showColumn];
    _showColumn[idx] = value;
    setShowColumn(_showColumn);
  };

  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setThumbSize(e.target.value);
  };

  const handleShowThumb = (showThumb: boolean) => {
    setShowThumb(showThumb);
  };

  return <div className="table-container p-4 bg-(--pokedex-red) relative">
    <Settings>
      <SettingsItem>
        <label htmlFor="showThumb">
          <Toggle value={showThumb} id="showThumb" onChange={handleShowThumb} childrenRight={t('settings.showThumb')} />
        </label>
      </SettingsItem>
      <SettingsItem className="mt-2">
        <label htmlFor="showThumb">
          <Toggle value={showShowColumn} id="showShowColumns" onChange={handleShowShowColumnChange} childrenRight="Show columns toggle" />
        </label>
      </SettingsItem>
      {showThumb && <div className="settings-item">
        <SettingsItem title={t('settings.size.title')}>
          <Select className="w-full" value={thumbSize} id="thumbSize" onChange={handleThumbSizeChange}>
            <option value="xs">{t('settings.size.xs')}</option>
            <option value="sm">{t('settings.size.sm')}</option>
          </Select>
        </SettingsItem>
      </div>}
    </Settings>
    <div className="overflow-auto h-[72vh] relative rounded">
      <table className="w-full text-xs">
        <thead className="bg-(--pokedex-red)">
          <tr className="sticky top-0 bg-(--pokedex-red) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2"></th>
            {(showShowColumn || showColumn[0]) && <th className="w-0 text-white text-center px-2 py-2">
              { !showShowColumn ? '#' :
                <Toggle
                  size="sm"
                  childrenLeft="#"
                  id="number"
                  value={showColumn[0]}
                  onChange={(e) => handleShowColumnChange(e, 0)} />
              }
            </th>}
            {(showShowColumn || showColumn[1]) && <th className="w-[18%] text-white text-left px-2 py-2">
              { !showShowColumn ? t('table.name') :
                <Toggle
                  size="sm"
                  childrenLeft={t('table.name')}
                  id={t('table.name')}
                  value={showColumn[1]}
                  onChange={(e) => handleShowColumnChange(e, 1)} />
              }
            </th>}
            {(showShowColumn || showColumn[2]) && <th className="text-white text-left px-2 py-2">
              { !showShowColumn ? t('table.types') :
                <Toggle
                  size="sm"
                  childrenLeft={t('table.types')}
                  id={t('table.types')}
                  value={showColumn[2]}
                  onChange={(e) => handleShowColumnChange(e, 2)} />
              }
            </th> }
            { !!pokemons.length && pokemons[0].stats.map((stat, idx) => {
              return (showShowColumn || showColumn[3 + idx]) && <th
                key={idx}
                className="text-white text-left px-2 py-2"
              >
                { !showShowColumn ? statName(stat.stat.name) :
                  <Toggle
                    size="sm"
                    childrenLeft={statName(stat.stat.name)}
                    id={statName(stat.stat.name)}
                    value={showColumn[idx + 3]}
                    onChange={(e) => handleShowColumnChange(e, idx + 3)}
                  />
                }
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
              <td className={`
                px-4
                ${isFirst ? 'pt-4' : ''}
                ${!showThumb ? 'py-4': 'py-2'}
              `}>
                {showThumb && <Link href={`/pokedex/${pokemon.name}`}>
                  <PokemonThumb pokemonData={pokemon} size={thumbSize} />
                </Link>}
              </td>
              {(showShowColumn || showColumn[0]) && <td className={`
                px-4
                ${isFirst ? 'pt-4' : ''}
                ${!isLast ? 'border-solid border-b-2 border-foreground text-center': ''} 
                ${!showThumb ? 'py-4': 'py-2'} 
              `}>
                <Link className="hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`}>
                  {getNumber(pokemon.id)}
                </Link>
              </td>}
              {(showShowColumn || showColumn[1]) && <td className={`
                px-4 
                ${isFirst ? 'pt-4' : ''}
                ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
                ${!showThumb ? 'py-4': 'py-2'} 
              `}>
                <Link className="text-bold hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`}>
                  {normalizePokemonName(pokemon.name)}
                </Link>
              </td>}
              {(showShowColumn || showColumn[2]) && <td className={`
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
              </td>}
              { pokemon.stats.map((stat, idx) => {
                return (showShowColumn || showColumn[3 + idx]) &&<td
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
            <td className="py-2" colSpan={11}>{ children }</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>;
}