import { sortResources, updateSortKeys } from '@/components/shared/table/sorting';
import Toggle from '@/components/shared/toggle';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { statName } from '../../[id]/details/stats';
import SortButton, { ResetSortButton } from '../../shared/table/sort-button';
import LazyRow from './lazy-row';
import { shouldShowColumn } from './utils';
export type SortKey = 'id' | 'name' | 'hp' | 'types' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export default function PokedexTable({ pokemons }: { pokemons: IPkmn[] }) {
  const { user, settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const [sorting, setSorting] = useState<Array<{ key: SortKey, dir: '+' | '-' }>>([]);

  const handleShowColumnChange = (value: boolean, idx: number) => {
    const _showColumn = (settings && [...settings?.showColumn]) ?? [];
    _showColumn[idx] = value;
    if(user)
      upsertSettings({ showColumn: _showColumn }, user?.id);
  };

  const toggleSort = (key: SortKey) => {
    setSorting(prev => {
      const updated = updateSortKeys(prev, key);
      upsertSettings({ sorting: updated });
      return updated;
    });
  };

  useEffect(() => {
    const sortingValues = settings && Array.isArray(settings.sorting) ? settings.sorting : [];
    setSorting(sortingValues);
  }, [settings?.sorting]);

  // eslint-disable-next-line no-unused-vars
  const sortMapping: (a: IPkmn, b: IPkmn) => Record<SortKey, [number | string, number | string]> = (a,b) => ({
    'types': [a.types.map(t => t.type.name).join(","), b.types.map(t => t.type.name).join(",")],
    'id': [Number(a.id), Number(b.id)],
    'name': [a.name, b.name],
    'hp': [a.stats[0].base_stat, b.stats[0].base_stat],
    'attack': [a.stats[1].base_stat, b.stats[1].base_stat],
    'defense': [a.stats[2].base_stat, b.stats[2].base_stat],
    'special-attack': [a.stats[3].base_stat, b.stats[3].base_stat],
    'special-defense': [a.stats[4].base_stat, b.stats[4].base_stat],
    'speed': [a.stats[5].base_stat, b.stats[5].base_stat],
  });

  const sortedPokemon = pokemons
    .sort(sortResources(sorting, sortMapping, 'id'));

  return settings && <div className="table-container p-2 bg-(--pokedex-red) w-full">
    <div className="overflow-auto h-[82vh] relative rounded shadow-md">
      <table className="w-full text-xs rounded">
        <thead>
          <tr className="sticky top-0 bg-(--pokedex-red-dark) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2">
              <ResetSortButton disabled={sorting.length === 0} onClick={() => {
                setSorting([]);
                upsertSettings({ sorting: [] });
              }} />
            </th>
            {settings && <th className="w-0 text-white text-center px-2 py-2">
              <SortButton attr="id" onClick={() => toggleSort("id")} sorting={sorting}>#</SortButton>
            </th>}
            {shouldShowColumn(settings, 1) && <th className="w-[18%] text-white text-left px-2 py-2">
              <SortButton attr="name" onClick={() => toggleSort("name")} sorting={sorting}>{t('table.name')}</SortButton>
            </th>}
            {shouldShowColumn(settings, 2) && <th className="text-white text-left px-2 py-2">
              {!settings.showShowColumn ?
                <SortButton onClick={() => toggleSort("types")} sorting={sorting} attr="types">{t('table.types')}</SortButton> :
                <Toggle
                  size="sm"
                  childrenLeft={t('table.types')}
                  id={t('table.types')}
                  value={settings.showColumn[2]}
                  onChange={(e) => handleShowColumnChange(e, 2)} />}
            </th>}
            { !!pokemons.length && pokemons[0].stats.map((stat, idx) => {
              return shouldShowColumn(settings, 3 + idx) && <th
                key={idx}
                className="text-white text-center px-2 py-2"
              >
                { !settings.showShowColumn ?
                  <SortButton
                    onClick={() => toggleSort(stat.stat.name as SortKey)}
                    sorting={sorting}
                    attr={stat.stat.name as SortKey}
                  >
                    {statName(stat.stat.name)}
                  </SortButton> :
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
            <th className="w-[1%]">
            </th>
          </tr>
        </thead>
        <tbody className="bg-background">
          {
            sortedPokemon
              .map((pokemon, i) => {
                const isFirst = i === 0;
                const isLast = i === pokemons.length - 1;
                return settings && <LazyRow key={i} isFirst={isFirst} isLast={isLast} pokemon={pokemon} />;
              })
          }
        </tbody>
      </table>
    </div>
  </div>;
}