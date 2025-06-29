'use client';

import Select from '@/components/shared/select';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { normalizePokemonName } from '@/components/shared/utils';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  const { settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbSizeList: e.target.value });
  };

  const handleThumbLabelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbLabelList: e.target.value });
  };

  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    function updateWidth() {
      const parent = parentRef.current;
      if (!parent) return;
      const parentWidth = parent.offsetWidth;
      const itemWidth = (() =>{
        switch (settings?.thumbSizeList) {
          case 'xs':
            return 120;
          case 'sm':
            return 160;
          case 'base':
            return 200;
          case 'lg':
            return 320;
        }
        return 0;
      })();

      const gap = 16; // gap-4 = 1rem = 16px
      // Calculate how many items fit
      const itemsPerRow = Math.max(1, Math.floor((parentWidth - 2 * gap) / (itemWidth + gap)));
      const totalWidth = itemsPerRow * itemWidth + (itemsPerRow - 1) * gap;
      setContainerWidth(totalWidth);
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Optional: Use ResizeObserver for more accurate resizing
    let observer: ResizeObserver | undefined;
    if (parentRef.current && 'ResizeObserver' in window) {
      observer = new ResizeObserver(updateWidth);
      observer.observe(parentRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateWidth);
      if (observer && parentRef.current) observer.unobserve(parentRef.current);
    };
  }, [settings?.thumbSizeList]);

  return (
    settings && <div className="list-container p-4 bg-(--pokedex-red) relative" ref={parentRef}>
      <Settings>
        <SettingsItem title={t('settings.size.title')} htmlFor="thumbSize">
          <Select className="w-full" value={settings?.thumbSizeList} id="thumbSize" onChange={handleThumbSizeChange}>
            <option value="xs">{t('settings.size.xs')}</option>
            <option value="sm">{t('settings.size.sm')}</option>
            <option value="base">{t('settings.size.base')}</option>
          </Select>
        </SettingsItem>
        <SettingsItem title={t('settings.label.title')} htmlFor="thumbLabel">
          <Select className="w-full" value={settings?.thumbLabelList} id="thumbLabel" onChange={handleThumbLabelChange}>
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
        <div
          className="
            mx-auto
            flex
            gap-4
            content-start
            flex-row
            flex-wrap
          "
          style={containerWidth ? { width: containerWidth } : undefined}
        >
          {
            pokemons.map((pokemon, i) => {
              const linkThumb = <Link href={`/pokedex/${pokemon.name}`} className="link">
                <PokemonThumb
                  showName={settings.thumbLabelList === 'thumbnail'}
                  pokemonData={pokemon}
                  size={isMobile ? 'xs': settings.thumbSizeList} />
              </Link>;

              return <div key={i}>
                {settings.thumbLabelList == 'tooltip' &&
                <Tooltip content={`${normalizePokemonName(pokemon.name)} ${getNumber(pokemon.id)}`}>
                  { linkThumb }
                </Tooltip>}
                {(settings.thumbLabelList == 'thumbnail' || settings.thumbLabelList == 'none') && linkThumb}
              </div>;
            })
          }
          { children }
        </div>
      </div>
    </div>
  );
}