import { IPkmn } from '@/app/types';
import Image from 'next/image';
import { IPokemonType } from 'pokeapi-typescript';
import { CSSProperties, Suspense, useEffect, useState } from 'react';
import './thumb.scss';

export function getArtwork(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getNumber(id: number) {
  return ('00' + id.toString()).slice(-3);
}

export function getBackgroundStyle(types: IPokemonType[] = []): CSSProperties {
  const colors = types?.map(type => getTypeColor(type.type.name)) || [];
  return colors.length === 1 ? { 'background': `${colors[0]}` } : getGradientStyle(colors);
}

function getGradientStyle(colors: string[]): CSSProperties {
  return { background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`};
}

function getTypeColor(type: string) {
  return {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  }[type] ?? '#CCCCCC';
}

export default function PokemonThumb({
  pokemonData,
  size = 'small'
}: Readonly<{
  pokemonData: IPkmn,
  size?: string
}>) {
  const [pokemon, setPokemon] = useState<IPkmn | null>(null);

  useEffect(() => {
    setPokemon(pokemonData);
  }, [pokemonData]);

  const loading = <span className={`my-auto`}>Loading...</span>;
  const isTiny = size === 'tiny' && ['w-40 h-40', 'h-[160px]', 'mb-1', 'text-xs'];
  const isSmall = size === 'small' && ['w-50 h-50', 'h-[200px]', 'mb-2', 'text-sm'];
  const classes = isTiny || isSmall || ['w-80 h-80', 'h-[320px]', 'mb-4', 'text-base'];

  const loaded = pokemon && (
    <div
      style={ pokemon ? getBackgroundStyle(pokemon.types) : {'background': '#CCCCC'}}
      className={`pokemon flex flex-col justify-center items-center ${classes[0]}`}
    >
      <div className={`pokemon-shadow bg-[rgba(0,0,0,0.2)] ${classes[0]}`}></div>
      <div className="img-hover-zoom w-full h-full">
        <div className={`relative w-full ${classes[1]}`}>
          <Image
            className="artwork"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getArtwork(pokemon.id)}
            alt={pokemon.name}
            priority={true}
          />
        </div>
      </div>
      <span className={`name ${classes[3]}`}>{ pokemon.name }</span>
      <span className={`id ${classes[2]} ${classes[3]}`}>#{ getNumber(pokemon.id) }</span>
    </div>
  );

  return (
    <Suspense>
      {pokemon ? loaded : loading}
    </Suspense>
  );
}