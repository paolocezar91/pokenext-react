import Toggle from '@/components/shared/toggle';
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from '@/components/shared/utils';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { statName } from '../../[id]/details/stats';
import { getTypeIconById } from '../../[id]/details/types';
import PokemonThumb, { getNumber } from '../../shared/thumb/thumb';
import { PokedexSettings, SettingsItem } from '../settings/pokedex-settings';
import { Settings as UserSettings } from '@/context/user-api';

const shouldShowColumn = (settings: UserSettings, i: number) => settings?.showShowColumn || settings?.showColumn[i];

function LazyRow(
  { settings, isFirst, isLast, pokemon }:
  { settings: UserSettings, isFirst: boolean, isLast: boolean, pokemon: IPkmn }
) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  return <tr ref={ref} className="bg-background">
    {inView ? settings && <>
      <td className={`
        px-4
        ${isFirst ? 'pt-4' : ''}
        ${!settings.showThumbTable ? 'py-4': 'py-2'}
      `}>
        {settings.showThumbTable && <Link href={`/pokedex/${pokemon.name}`}>
          <PokemonThumb pokemonData={pokemon} size="xs" />
        </Link>}
      </td>
      {(settings.showShowColumn || settings.showColumn[0]) && <td className={`
        px-4
        ${isFirst ? 'pt-4' : ''}
        ${!isLast ? 'border-solid border-b-2 border-foreground text-center': ''} 
        ${!settings.showThumbTable ? 'py-4': 'py-2'} 
      `}>
        <Link className="hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`}>
          {getNumber(pokemon.id)}
        </Link>
      </td>}
      {shouldShowColumn(settings, 1) && <td className={`
        px-4 
        ${isFirst ? 'pt-4' : ''}
        ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
        ${!settings.showThumbTable ? 'py-4': 'py-2'} 
      `}>
        <Link className="text-bold hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`}>
          {normalizePokemonName(pokemon.name)}
        </Link>
      </td>}
      {(settings.showShowColumn || settings.showColumn[2]) && <td className={`
        px-4
        ${!isLast ? 'border-solid border-b-2 border-foreground': ''}
        ${!settings.showThumbTable ? 'py-4': 'py-2'}
        ${isFirst ? 'pt-4' : ''}
      `}>
        {pokemon.types.map((t, idx) =>
          <Link href={`/type/${t.type.name}`} key={idx}>
            <Image
              width="100"
              height="20"
              className="inline m-1"
              alt={capitilize(t.type.name)}
              src={getTypeIconById(getIdFromUrlSubstring(t.type.url), settings.typeArtworkUrl)} />
          </Link>
        )}
      </td>}
      { pokemon.stats.map((stat, idx) => {
        return (settings.showShowColumn || settings.showColumn[3 + idx]) && <td key={idx} className={`
          px-4
          ${isFirst ? 'pt-4' : ''}
          ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
          ${!settings.showThumbTable ? 'py-4': 'py-2'}
        `}>
          { stat.base_stat }
        </td>;
      }) }
      <td></td>
    </> : null}
  </tr>;
}

export default function PokedexTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const { user, settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');

  const handleShowShowColumnChange = (value: boolean) => {
    if(user)
      upsertSettings({ showShowColumn: value }, user?.id);
  };

  const handleShowColumnChange = (value: boolean, idx: number) => {
    const _showColumn = (settings && [...settings?.showColumn]) ?? [];
    _showColumn[idx] = value;
    if(user)
      upsertSettings({ showColumn: _showColumn }, user?.id);
  };

  const handleShowThumb = (showThumbTable: boolean) => {
    if(user)
      upsertSettings({ showThumbTable }, user?.id);
  };


  return settings && <div className="table-container p-4 bg-(--pokedex-red) relative">
    <PokedexSettings>
      <SettingsItem htmlFor="showThumb">
        <Toggle
          value={settings.showThumbTable}
          id="showThumb"
          onChange={handleShowThumb}
          childrenRight={t('settings.showThumb')}
        />
      </SettingsItem>
      <SettingsItem className="mt-2" htmlFor="showThumb">
        <Toggle
          value={settings.showShowColumn}
          id="showShowColumns"
          onChange={handleShowShowColumnChange}
          childrenRight={t('settings.showShowColumns')} />
      </SettingsItem>
    </PokedexSettings>
    <div className="overflow-auto h-[72vh] relative rounded">
      <table className="w-full text-xs">
        <thead className="bg-(--pokedex-red)">
          <tr className="sticky top-0 bg-(--pokedex-red) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2"></th>
            {settings && <th className="w-0 text-white text-center px-2 py-2">
              #
            </th>}
            {shouldShowColumn(settings, 1) && <th className="w-[18%] text-white text-left px-2 py-2">
              {t('table.name')}
            </th>}
            {shouldShowColumn(settings, 2) && <th className="text-white text-left px-2 py-2">
              { !settings.showShowColumn ? t('table.types') :
                <Toggle
                  size="sm"
                  childrenLeft={t('table.types')}
                  id={t('table.types')}
                  value={settings.showColumn[2]}
                  onChange={(e) => handleShowColumnChange(e, 2)} />
              }
            </th> }
            { !!pokemons.length && pokemons[0].stats.map((stat, idx) => {
              return shouldShowColumn(settings, 3 + idx) && <th
                key={idx}
                className="text-white text-left px-2 py-2"
              >
                { !settings.showShowColumn ? statName(stat.stat.name) :
                  <Toggle
                    size="sm"
                    childrenLeft={statName(stat.stat.name)}
                    id={statName(stat.stat.name)}
                    value={settings.showColumn[idx + 3]}
                    onChange={(e) => handleShowColumnChange(e, idx + 3)}
                  />
                }
              </th>;
            }) }
            <th className="w-[1%]"></th>
          </tr>
        </thead>
        <tbody className="bg-background">
          {
            pokemons.map((pokemon, i) => {
              const isFirst = i === 0;
              const isLast = i === pokemons.length - 1;
              return settings && <LazyRow key={i} isFirst={isFirst} isLast={isLast} pokemon={pokemon} settings={settings}></LazyRow>;
            })
          }
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