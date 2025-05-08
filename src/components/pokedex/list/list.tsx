'use client';

import { IPkmn } from '@/app/types';
import Select from '@/components/shared/select';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { normalizePokemonName, useLocalStorage } from '@/components/shared/utils';
import Link from 'next/link';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PokemonThumb, { getNumber } from '../../shared/thumb/thumb';
import { Settings, SettingsItem } from '../settings/settings';
import './list.scss';

export default function PokemonList({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  const [thumbSize, setThumbSize] = useLocalStorage('thumbSizeList', 'base');
  const [thumbLabel, setThumbLabel] = useLocalStorage('thumbLabelList', 'thumbnail');
  const { t } = useTranslation('common');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setThumbSize(e.target.value);
  };

  const handleThumbLabelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setThumbLabel(e.target.value);
  };

  return (
    <div className="list-container p-4 bg-(--pokedex-red) relative">
      <Settings>
        <SettingsItem title={t('settings.size.title')} htmlFor="thumbSize">
          <Select className="w-full" value={thumbSize} id="thumbSize" onChange={handleThumbSizeChange}>
            <option value="xs">{t('settings.size.xs')}</option>
            <option value="sm">{t('settings.size.sm')}</option>
            <option value="base">{t('settings.size.base')}</option>
          </Select>
        </SettingsItem>
        <SettingsItem title={t('settings.label.title')} htmlFor="thumbLabel">
          <Select className="w-full" value={thumbLabel} id="thumbLabel" onChange={handleThumbLabelChange}>
            <option value="tooltip">{t('settings.label.tooltip')}</option>
            <option value="thumbnail">{t('settings.label.thumbnail')}</option>
            <option value="none">{t('settings.label.none')}</option>
          </Select>
        </SettingsItem>
      </Settings>
      <div className="
        list
        relative
        h-[-webkit-fill-available]
        overflow-auto
        rounded
        bg-background
        rounded-b-lg
        p-4
      ">
        <div className="
        mx-auto
        flex
        gap-4
        justify-center
        content-start
        flex-row
        flex-wrap
        ">
          {
            pokemons.map((pokemon, i) => {
              const linkThumb = <Link href={`/pokedex/${pokemon.name}`} className="link">
                <PokemonThumb showName={thumbLabel === 'thumbnail'} pokemonData={pokemon} size={isMobile ? 'xs': thumbSize} />
              </Link>;

              return <div key={i}>
                {thumbLabel == 'tooltip' &&
                <Tooltip content={`${normalizePokemonName(pokemon.name)} ${getNumber(pokemon.id)}`}>
                  { linkThumb }
                </Tooltip>}
                {(thumbLabel == 'thumbnail' || thumbLabel == 'none') && linkThumb}
              </div>;
            })
          }
          { children }
        </div>
      </div>
    </div>
  );
}