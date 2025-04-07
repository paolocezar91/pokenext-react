'use client';

import '@/app/globals.css';
import RootLayout from '@/app/layout';
import { IPkmn } from '@/app/types';
import PokemonList from '@/components/list/list';
import PokemonSearch from '@/components/list/search';
import Spinner from '@/components/spinner/spinner';
import { Metadata } from "next";
import { INamedApiResourceList, IPokemon } from 'pokeapi-typescript';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const NUMBERS_OF_POKEMON = 25;
const STARTING_POKEMON = 0;

export const metadata: Metadata = {
  title: "Next.js Pokédex Demo",
  description: 'A React.js Demo for a 151 Pokemon Pokedex'
};

export async function getPokemonPage(offset: number, limit: number): Promise<IPkmn[]> {
  try {
    const pkmnListCall = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
    const pkmnList = await pkmnListCall.json() as INamedApiResourceList<IPokemon>;
    // const pkmnList = await PokeAPI.Pokemon.list(limit, offset);
    const pokemonData = await Promise.all(
      pkmnList.results.map(async (pkmn) => {
        const pokemon = (await(await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn.name}/`)).json()) as IPokemon;
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
  };
}

export default function Main({ pokemonsData }: { pokemonsData: IPkmn[] }) {
  const { ref, inView } = useInView();
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [pokemonsBackup, setPokemonsBackup] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [offset, setOffset] = useState(STARTING_POKEMON + NUMBERS_OF_POKEMON);

  useEffect(() => {
    async function loadMorePkmn() {
      setLoading(true);
      const morePkmn = await getPokemonPage(offset, NUMBERS_OF_POKEMON);
      if (morePkmn.length > 0){
        setPokemons(pkmn => [...pkmn, ...morePkmn]);
        setPokemonsBackup(pokemons);
        setOffset(offset => offset + NUMBERS_OF_POKEMON);
        setLoading(false);
      }
    }

    if (inView && !loading) {
      loadMorePkmn();
    }
  }, [pokemonsData, pokemons, inView, offset, loading]);

  const filter = (filterText: string) => {
    setFiltered(!!filterText);
    if(filterText) {
      setPokemons(pokemonsBackup.filter(pkmn => {
        const filteredValues = [pkmn.name, pkmn.types[0].type.name];
        if(pkmn.types[1]) {
          filteredValues.push(pkmn.types[1].type.name);
        }
        return filteredValues.some((value) => value.toLowerCase().includes(filterText.toLowerCase()));
      }));
    } else {
      setPokemons(pokemonsBackup);
    }
  };

  if (!pokemons) return null;

  return (
    <RootLayout title={String(metadata.title)}>
      <PokemonSearch onFilter={filter}/>
      <PokemonList pokemons={pokemons} ref={ref} inView={inView} searched={filtered}/>
      {loading && <Spinner /> }
    </RootLayout>
  );
}
