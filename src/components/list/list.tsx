'use client';

import { IPkmn } from '@/app/types';
import Link from 'next/link';
import PokemonThumb from '../thumb/thumb';

export default function PokemonList({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  return (
    <div className="list-container">
      <div className="list relative flex justify-center flex-row flex-wrap p-4">
        {
          pokemons.map((pokemon, i) => {
            return <Link href={`/pokedex/${pokemon.name}`} key={i} className="my-1 mx-1 link">
              <PokemonThumb pokemonData={pokemon} />
            </Link>;
          })
        }
        { children }
      </div>
    </div>
  );
}