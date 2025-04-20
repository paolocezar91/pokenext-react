'use client';

import { IPkmn } from '@/app/types';
import Link from 'next/link';
import PokemonThumb from '../../shared/thumb/thumb';
import './list.scss';

export default function PokemonList({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  return (
    <div className="list-container p-4 bg-(--pokedex-red)">
      <div className="list h-full relative overflow-auto p-4 rounded bg-background flex justify-center flex-row flex-wrap rounded-b-lg">
        {
          pokemons.map((pokemon, i) => {
            return <Link href={`/pokedex/${pokemon.name}`} key={i} className="my-1 mx-1 link">
              <PokemonThumb pokemonData={pokemon} showName={true} />
            </Link>;
          })
        }
        { children }
      </div>
    </div>
  );
}