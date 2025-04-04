import { IPkmn } from '@/app/types';
import Link from 'next/link';
import PokemonThumb from '../thumb/thumb';
import './list.scss';

export default function PokemonList({ pokemons, ref, inView }: Readonly<{ pokemons: IPkmn[], ref: (node?: Element | null) => void, inView: boolean }>) {
  
  return (
    <div className="list flex justify-center flex-row flex-wrap p-4">
      { 
        pokemons.map((pokemon, i) => {
          return <Link href={`/pokemon/${i + 1}`} key={i} className="my-1 mx-1 link">
            <PokemonThumb pokemonData={pokemon} />
          </Link>
        })
      }
      {!inView && <div className='pokemon flex flex-col justify-center items-center' ref={ref}> Loading... </div>}
    </div>
  );
}