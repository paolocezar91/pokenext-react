import './thumb.scss';
import { CSSProperties, Suspense, useEffect, useState } from 'react';
import { IPkmn } from '@/app/types';
import { IPokemonType } from 'pokeapi-typescript';
import Image from 'next/image';

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
  const isSmall = size === 'small';

  const loaded = pokemon && (
    <div style={ pokemon ? getBackgroundStyle(pokemon.types) : {'background': '#CCCCC'}} className={`pokemon flex flex-col justify-center items-center ${isSmall ? 'w-50 h-50' : 'w-80 h-80'}`}>
      <div className={`pokemon-shadow bg-[rgba(0,0,0,0.2)] ${isSmall ? 'w-50 h-50' : 'w-75 h-75'}`}></div>
      <div className="img-hover-zoom w-full h-full">
        <div className={`relative w-full ${isSmall ? 'h-[200px]' : 'h-[320px]'}`}>
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
      <span className="name">{ pokemon.name }</span>
      <span className={`id ${isSmall ? 'mb-2' : 'mb-4'} `}>#{ getNumber(pokemon.id) }</span>
    </div>
  );

  return (
    <Suspense>
      {pokemon ? loaded : loading}
    </Suspense>
  );
}