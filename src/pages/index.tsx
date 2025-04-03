"use client";

import '@/app/globals.css';
import RootLayout from '../components/layout/layout';
import PokeAPI, { IPokemon } from 'pokeapi-typescript';
import PokemonList from '@/components/list/list';
import { useEffect, useState } from 'react';
// import PokemonSearch from '@/components/list/search';

export async function getStaticProps() {
  const ids = Array.from({length: 151}, (_, i) => String(i + 1));

  const pokemonsData = await Promise.all(
    ids.map(async (idx) => {
      const pokemon = await PokeAPI.Pokemon.resolve(idx)
      return { name: pokemon.name, types: pokemon.types, id: pokemon.id };
    })
  )

  return {
    props: { pokemonsData },
  }
}

export default function Main({ pokemonsData }: { pokemonsData: IPokemon[] }) {
  const [pokemons, setPokemons] = useState<IPokemon[] | null>(null);
    
  useEffect(() => {
    setPokemons(pokemonsData);
  }, [pokemonsData])

  if (!pokemons) return null;
  
  return (
    <RootLayout>
      {/* <PokemonSearch /> */}
      <PokemonList pokemons={pokemons} />
    </RootLayout>
  );
}
