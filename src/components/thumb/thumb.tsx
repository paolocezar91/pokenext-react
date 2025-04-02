import PokeAPI, { INamedApiResource, IPokemon, IPokemonType } from 'pokeapi-typescript';
import Image from 'next/image';
import { CSSProperties } from 'react';
import './thumb.scss'

function getArtwork(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getNumber(id: number) {
  return ('00' + id.toString()).slice(-3);
}

export function getBackgroundStyle(types: IPokemonType[] = []): CSSProperties {
	const colors = types?.map(type => getTypeColor(type.type.name)) || [];
	return colors.length === 1 ? { 'background': `${colors[0]}` } : getGradientStyle(colors);
}

export function getGradientStyle(colors: string[]): CSSProperties {
	return { background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`};
}

export function getTypeColor(type: string) {
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

export async function getStaticProps({ pkmn }: Readonly<{ pkmn: INamedApiResource<IPokemon> }>) {
  const pokemon = await PokeAPI.Pokemon.get(pkmn.name);
  return { props: { pokemon }};
}


export default function PokemonThumb({ pokemon }: Readonly<{ pokemon: IPokemon }>) {

  return (
    <div 
      className="pokemon flex flex-col justify-center items-center" 
      style={getBackgroundStyle(pokemon.types)}
    >
      <div className="img-hover-zoom pt-1">
        
          <Image
            width={138}      
            height={138}
            className="artwork" src={getArtwork(pokemon.id)} alt={pokemon.name} />
      </div>
      <span className="name">{ pokemon.name }</span>
      <span className="id pb-2">#{ getNumber(pokemon.id) }</span>
    </div>
  );
}