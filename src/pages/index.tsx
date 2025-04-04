"use client";

import '@/app/globals.css';
import RootLayout from '../app/layout';
import { INamedApiResourceList, IPokemon } from 'pokeapi-typescript';
import PokemonList from '@/components/list/list';
import { useEffect, useState } from 'react';
import { Metadata } from "next";
import PokemonSearch from '@/components/list/search';
import { IPkmn } from '@/app/types';
import { useInView } from 'react-intersection-observer'

const NUMBERS_OF_POKEMON = 30;
const STARTING_POKEMON = 0;

export const metadata: Metadata = {
  title: "Next.js Pokédex Demo",
  description: 'A React.js Demo for a 151 Pokemon Pokedex'
}

export async function getPokemonPage(offset: number, limit: number): Promise<IPkmn[]> {
  try {
    const pkmnListCall = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
    const pkmnList = await pkmnListCall.json() as INamedApiResourceList<IPokemon>;
    // const pkmnList = await PokeAPI.Pokemon.list(limit, offset);
    const pokemonData = await Promise.all(
      pkmnList.results.map(async (pkmn) => {
        const pkmnCall = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn.name}/`);
        const pokemon = await pkmnCall.json() as IPokemon;        
        //const pokemon = await PokeAPI.Pokemon.fetch(pkmn.name);
        return { name: pokemon.name, types: pokemon.types, id: pokemon.id };
      })
    );

    return pokemonData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStaticProps() {
  return {
    props: { pokemonsData: await getPokemonPage(STARTING_POKEMON, NUMBERS_OF_POKEMON) },
  }
}

export default function Main({ pokemonsData }: { pokemonsData: IPkmn[] }) {
  const { ref, inView } = useInView()
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState(NUMBERS_OF_POKEMON);
  
  useEffect(() => {
    async function loadMorePkmn() {
        setLoading(true);
        const morePkmn = await getPokemonPage(offset, NUMBERS_OF_POKEMON);
        if (morePkmn.length > 0){
          setPokemons(pkmn => [...pkmn, ...morePkmn]);
          setOffset(offset => offset + NUMBERS_OF_POKEMON);
          setLoading(false);
        }
    }

    if (inView && !loading) {
      loadMorePkmn()
    }
  }, [pokemonsData, inView, offset, loading]);

  if (!pokemons) return null;
  
  return (
    <RootLayout title="Next.js Pokédex Demo">
      <PokemonSearch />
      <PokemonList pokemons={pokemons} ref={ref} inView={inView} />
    </RootLayout>
  );
}
