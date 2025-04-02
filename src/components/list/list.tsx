import { IPokemon } from 'pokeapi-typescript';
import './list.scss';
import PokemonThumb from '../thumb/thumb';
import Link from 'next/link';

export default function PokemonList({ pokemons }: Readonly<{ pokemons: IPokemon[] }>) {
  
  return (
    <div className="list flex justify-center flex-row flex-wrap p-4">
      {
        pokemons.map((pokemon, i) => {
          return <Link href={`/pokemon/${pokemon.id}`} key={i} className="my-1 mx-1 link">
            <PokemonThumb pokemon={pokemon} />
          </Link>
        })
      }
    </div>

  );
}