import Toggle from '@/components/shared/toggle';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { kebabToSpace } from '@/components/shared/utils';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import { ArrowLongDownIcon, ArrowLongUpIcon, ArrowsUpDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { statName } from '../../[id]/details/stats';
import { PokedexSettings, SettingsItem } from '../settings/pokedex-settings';
import LazyRow from './lazy-row';
import { shouldShowColumn, sortPokemon } from './utils';

export default function PokedexTable({
  pokemons,
}: Readonly<{
  pokemons: IPkmn[],
}>) {
  const { user, settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const [sort, setSort] = useState<Record<string, string>>({});

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

  const SortComponent = ({ children, attr, disabled }: { children: React.ReactNode, attr: string, disabled?: boolean }) => {
    let tooltipContent = "";
    let icon: React.ReactNode;
    const handleSort = (stat: string) => {
      let value: string;

      switch(sort[stat]) {
        case "+":
          value = "-";
          break;
        case "-":
          value = '';
          break;
        default:
          value = '+';
          break;
      }

      setSort(s => {
        const updatedSort = { ...s, [stat]: value };
        upsertSettings({ sorting: updatedSort });
        return updatedSort;
      });
    };

    if(!sort[attr]) {
      tooltipContent=`Sort ${kebabToSpace(attr)} ascending`;
      icon = <ArrowsUpDownIcon className="w-5" />;
    }
    if(sort[attr] === '+'){
      tooltipContent = `Sort ${kebabToSpace(attr)} descending`;
      icon = <ArrowLongUpIcon className="w-5" />;
    }
    if(sort[attr] === '-'){
      tooltipContent = `Unsort ${kebabToSpace(attr)}`;
      icon = <ArrowLongDownIcon className="w-5" />;
    }

    return <Tooltip content={tooltipContent}>
      <Button
        disabled={disabled}
        className={`
        flex 
        items-start
        ml-1
        px-2
        py-1
        cursor-pointer
        rounded
        bg-(--pokedex-red-dark)
        hover:bg-(--pokedex-red-darker)
        ${sort[attr] && 'bg-white text-(--pokedex-red-dark) hover:text-white'}
      `}
        onClick={() => handleSort(attr)}>
        <span className="mr-1">{children}</span>
        {icon}
      </Button>
    </Tooltip>;
  };

  const ResetSortComponent = () => {
    const resetSort = () => {
      setSort({});
      upsertSettings({ sorting: {}});
    };

    return <Tooltip content="Reset sorting">
      <Button
        disabled={Object.values(sort).every(v => !v)}
        className={`
        ml-1
        p-1
        cursor-pointer
        rounded
        text-(--pokedex-red-darker)
        bg-white
        hover:bg-(--pokedex-red-darker)
        hover:text-white
        disabled:bg-(--pokedex-red)
        disabled:text-white
        disabled:opacity-50
                `}
        onClick={() => resetSort()}>
        <XMarkIcon className="w-5" />
      </Button>
    </Tooltip>;
  };

  useEffect(() => {
    if(settings){
      setSort(settings?.sorting);
    }
  }, [settings?.sorting]);


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
    <div className="overflow-auto h-[72vh] relative rounded shadow-md">
      <table className="w-full text-xs rounded">
        <thead>
          <tr className="sticky top-0 bg-(--pokedex-red-dark) z-1">
            <th className="w-[1%] text-white text-center px-2 py-2">
              <ResetSortComponent />
            </th>
            {settings && <th className="w-0 text-white text-center px-2 py-2">
              <SortComponent attr="id">#</SortComponent>
            </th>}
            {shouldShowColumn(settings, 1) && <th className="w-[18%] text-white text-left px-2 py-2">
              <SortComponent attr="name">{t('table.name')}</SortComponent>
            </th>}
            {shouldShowColumn(settings, 2) && <th className="text-white text-left px-2 py-2">
              {!settings.showShowColumn ?
                <SortComponent attr="types">{t('table.types')}</SortComponent> :
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
                  <SortComponent attr={stat.stat.name}>{statName(stat.stat.name)}</SortComponent> :
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
            pokemons
              .sort(sortPokemon(sort))
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