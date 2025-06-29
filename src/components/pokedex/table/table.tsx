import Toggle from '@/components/shared/toggle';
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from '@/components/shared/utils';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { statName } from '../../[id]/details/stats';
import { getTypeIconById } from '../../[id]/details/types';
import PokemonThumb, { getNumber } from '../../shared/thumb/thumb';
import { Settings, SettingsItem } from '../settings/settings';

export default function PokemonTable({
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

  // const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   if(user)
  //     upsertSettings(user?.id, { thumbSize: e.target.value });
  // };

  const handleShowThumb = (showThumbTable: boolean) => {
    if(user)
      upsertSettings({ showThumbTable }, user?.id);
  };

  return settings && <div className="table-container p-4 bg-(--pokedex-red) relative">
    <Settings>
      <SettingsItem>
        <label htmlFor="showThumb">
          <Toggle value={settings.showThumbTable} id="showThumb" onChange={handleShowThumb} childrenRight={t('settings.showThumb')} />
        </label>
      </SettingsItem>
      <SettingsItem className="mt-2">
        <label htmlFor="showThumb">
          <Toggle
            value={settings.showShowColumn}
            id="showShowColumns"
            onChange={handleShowShowColumnChange}
            childrenRight={t('settings.showShowColumns')} />
        </label>
      </SettingsItem>
      {/* <div className="settings-item">
        <SettingsItem title={t('settings.size.title')}>
          <Select className="w-full" value={settings.thumbSizeTable} id="thumbSize" onChange={handleThumbSizeChange}>
            <option value="xs">{t('settings.size.xs')}</option>
            <option value="sm">{t('settings.size.sm')}</option>
          </Select>
        </SettingsItem>
      </div> */}
    </Settings>
    <div className="overflow-auto h-[72vh] relative rounded">
      <table className="w-full text-xs">
        <thead className="bg-(--pokedex-red)">
          <tr className="sticky top-0 bg-(--pokedex-red) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2"></th>
            {(settings.showShowColumn || settings.showColumn[0]) && <th className="w-0 text-white text-center px-2 py-2">
              #
            </th>}
            {(settings.showShowColumn || settings.showColumn[1]) && <th className="w-[18%] text-white text-left px-2 py-2">
              {t('table.name')}
            </th>}
            {(settings.showShowColumn || settings.showColumn[2]) && <th className="text-white text-left px-2 py-2">
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
              return (settings.showShowColumn || settings.showColumn[3 + idx]) && <th
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
          { pokemons.map((pokemon, i) => {
            const isFirst = i === 0;
            const isLast = i === pokemons.length - 1;

            return <tr key={i} className="bg-background">
              <td className={`
                px-4
                ${isFirst ? 'pt-4' : ''}
                ${!settings.showThumbTable ? 'py-4': 'py-2'}
              `}>
                {settings.showThumbTable && <Link href={`/pokedex/${pokemon.name}`}>
                  <PokemonThumb pokemonData={pokemon} size={settings.thumbSizeTable} />
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
              {(settings.showShowColumn || settings.showColumn[1]) && <td className={`
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
                  <Image
                    key={idx}
                    width="100"
                    height="20"
                    className="inline m-1"
                    alt={capitilize(t.type.name)}
                    src={getTypeIconById(getIdFromUrlSubstring(t.type.url), settings.typeArtworkUrl)} />
                )}
              </td>}
              { pokemon.stats.map((stat, idx) => {
                return (settings.showShowColumn || settings.showColumn[3 + idx]) &&<td
                  key={idx}
                  className={`
                    px-4
                    ${isFirst ? 'pt-4' : ''}
                    ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
                    ${!settings.showThumbTable ? 'py-4': 'py-2'}
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