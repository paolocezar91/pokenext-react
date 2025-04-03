import { IPokemon } from 'pokeapi-typescript';
import './list.scss';
import Link from 'next/link';
import PokemonThumb from '../thumb/thumb';

export default function PokemonList({ pokemons }: Readonly<{ pokemons: IPokemon[] }>) {
  
  return (
    <div className="list flex justify-center flex-row flex-wrap p-4">
      { 
        pokemons.map((pokemon, i) => {
          return <Link href={`/pokemon/${i + 1}`} key={i} className="my-1 mx-1 link">
            <PokemonThumb pokemonData={pokemon} />
          </Link>
        })
      }
    </div>
  );
}