import { IPokemon, IPokemonType } from 'pokeapi-typescript';
import Image from 'next/image';
import { CSSProperties, useEffect, useState } from 'react';
import './thumb.scss'

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

export default function PokemonThumb({ pokemonData }: Readonly<{ pokemonData: IPokemon }>) {
  const [pokemon, setPokemon] = useState<IPokemon | null>(null);
  
  useEffect(() => {
    setPokemon(pokemonData);
  }, [pokemonData])
  
  const loading = <span className='my-auto'>Loading...</span>;

  const loaded = pokemon && (
    <div 
      className="pokemon flex flex-col justify-center items-center" 
      style={ pokemon ? getBackgroundStyle(pokemon.types) : {'background': '#CCCCC'}}
    >
      <div className="img-hover-zoom pt-1">
        <Image
          width={138}      
          height={138}
          className="artwork"
          src={getArtwork(pokemon.id)}
          alt={pokemon.name}
        />
      </div>
      <span className="name">{ pokemon.name }</span>
      <span className="id pb-2">#{ getNumber(pokemon.id) }</span>
    </div>
  );

  return (
    <div className="pokemon flex flex-col justify-center items-center">
      { pokemon ? loaded : loading }
    </div>
  );
}