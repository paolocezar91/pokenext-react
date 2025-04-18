import { IPkmn } from '@/app/types';
import { getIdFromUrlSubstring, normalizePokemonName } from '@/components/shared/utils';
import Image from 'next/image';
import { INamedApiResource, IPokemon, IPokemonType } from 'pokeapi-typescript';
import { CSSProperties, Suspense, useEffect, useState } from 'react';
import Spinner from '../spinner';
import './thumb.scss';

export function getArtwork(id: number) {
  const rv: Record<string, string[]> = {
    normal: [`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`],
    shiny: [`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`]
  };

  return rv;
}

export function getNumber(id: number) {
  return ('000' + id.toString()).slice(-4);
}

export function getBackgroundStyle(types: IPokemonType[] = []): CSSProperties {
  const colors = types?.map(type => getTypeColor(type.type.name)) || [];
  return colors.length === 1 ? { 'background': `${colors[0]}` } : getGradientStyle(colors);
}

export function getBackgroundStyleWithStrings(types: string[] = []): CSSProperties {
  const colors = types?.map(type => getTypeColor(type)) || [];
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
  pokemonDataSmall,
  hasShinyCheckbox = false,
  size = 'base',
  hasName = true,
  isMega = false,
}: Readonly<{
  pokemonData?: IPokemon | IPkmn,
  pokemonDataSmall?: INamedApiResource<IPokemon>,
  hasShinyCheckbox?: boolean,
  size?: string,
  isMega?: boolean,
  hasName?: boolean,
}>) {
  const [pokemon, setPokemon] = useState<IPokemon | IPkmn | null>(null);
  const [pokemonSmall, setPokemonSmall] = useState<INamedApiResource<IPokemon> | null>(null);

  const [shiny, setShiny] = useState<boolean>(false);

  useEffect(() => {
    if(pokemonData)
      setPokemon(pokemonData);
    if(pokemonDataSmall)
      setPokemonSmall(pokemonDataSmall);

  }, [pokemonData, pokemonDataSmall]);

  const loading = <span className="loading text-xs my-auto"><Spinner /></span>;
  const isXS = size === 'xs' && ['w-30 h-30', 'h-[120px]', 'mb-0', 'text-xs'];
  const isSM = size === 'sm' && ['w-40 h-40', 'h-[160px]', 'mb-1', 'text-xs'];
  const isBase = size === 'base' && ['w-50 h-50', 'h-[200px]', 'mb-2', 'text-sm'];
  const isLG = ['w-80 h-80', 'h-[320px]', 'mb-4', 'text-base'];
  const classes = isXS || isSM || isBase || isLG;

  let pkmn;
  if (pokemonSmall) {
    pkmn = {
      id: Number(getIdFromUrlSubstring(pokemonSmall.url)),
      name: pokemonSmall?.name
    };
  } else if(pokemon) {
    pkmn = pokemon;
  }


  const loaded = pkmn &&
    <div
      style={ pkmn ? getBackgroundStyle(pkmn?.types ?? []) : {'background': '#CCCCC'}}
      className={`pokemon flex flex-col justify-center items-center ${classes[0]} ${size} ${!hasName ? 'titleless' : ''}`}
    >
      <div className={`pokemon-shadow bg-[rgba(0,0,0,0.2)] ${classes[0]}`}></div>
      <div className="img-hover-zoom w-full h-full">
        <div className={`relative w-full ${classes[1]}`}>
          {!shiny && <Image
            className="artwork z-1"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getArtwork(pkmn.id).normal[0]}
            alt={`${normalizePokemonName(pkmn.name)} #${getNumber(pkmn.id)}}`}
            priority={true}
          />}
          {shiny && <Image
            className="artwork z-1"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getArtwork(pkmn.id).shiny[0]}
            alt={`Shiny ${normalizePokemonName(pkmn.name)} #${getNumber(pkmn.id)}}`}
            priority={true}
          />}
          {isMega && <Image
            className="artwork opacity-40 z-2"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="/mega-evo.png"
            alt={normalizePokemonName(pkmn.name)}
            priority={true}
          />}
        </div>
      </div>
      {hasName && <span className={`name text-white w-60 ${classes[3]}`}>{ normalizePokemonName(pkmn.name) }</span>}
      {hasName && <span className={`id text-white  ${classes[2]} ${classes[3]}`}>#{ getNumber(pkmn.id) }</span>}
    </div>
  ;

  return (
    <Suspense fallback={<Spinner />}>
      {pkmn ? loaded : loading}
      {
        hasShinyCheckbox && <label className="w-full text-right mt-1" htmlFor="shiny">
          Shiny<input
            id="shiny"
            name="shiny"
            className="mt-2 ml-2 text-xs"
            type="checkbox"
            checked={shiny}
            onChange={()=> setShiny(!shiny)}
          />
        </label>
      }
    </Suspense>
  );
}