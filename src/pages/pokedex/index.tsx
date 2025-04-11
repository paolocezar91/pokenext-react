'use client';

import { fetchPokemonDataList, fetchPokemonList } from '@/app/api';
import '@/app/globals.css';
import RootLayout from '@/app/layout';
import { IPkmn } from '@/app/types';
import PokemonList from '@/components/list/list';
import PokemonFilter from '@/components/list/filter';
import Spinner from '@/components/spinner/spinner';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const NUMBERS_OF_POKEMON = 20;
const STARTING_POKEMON = 0;

export const metadata: Metadata = {
  title: `Pokédex -- Next.js Demo`,
  description: 'A Next.js Demo for a 151 Pokemon Pokedex'
};

export async function getPokemonPage(offset: number, limit: number): Promise<IPkmn[]> {
  try {
    return await fetchPokemonDataList(await fetchPokemonList(limit, offset));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getStaticProps() {
  return {
    props: {
      pokemonsData: await getPokemonPage(STARTING_POKEMON, NUMBERS_OF_POKEMON),
    },
  };
}

export default function Pokedex({ pokemonsData }: { pokemonsData: IPkmn[] }) {
  const { ref, inView } = useInView({ threshold: 1 });
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [pokemonsBackup, setPokemonsBackup] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [offset, setOffset] = useState(STARTING_POKEMON + NUMBERS_OF_POKEMON);

  useEffect(() => {
    async function loadMorePkmn() {
      const morePkmn = await getPokemonPage(offset, NUMBERS_OF_POKEMON);
      if (morePkmn.length > 0){
        setPokemons(pkmn => [...pkmn, ...morePkmn]);
        setPokemonsBackup(pokemons);
        setOffset(offset => offset + NUMBERS_OF_POKEMON);
        setTimeout(() => setLoading(false));
      }
    }

    if (inView && !loading) {
      setLoading(true);
      loadMorePkmn();
    }
  }, [pokemonsData, pokemons, inView, offset, loading]);

  const filter = (filterText: string) => {
    setFiltered(!!filterText);
    if(filterText) {
      setPokemons(pokemonsBackup.filter(pkmn => {
        const filteredValues = [pkmn.name];

        return filteredValues.some((value) => value.toLowerCase().includes(filterText.toLowerCase()));
      }));
    } else {
      setPokemons(pokemonsBackup);
    }
  };

  if (!pokemons) return null;

  return (
    <RootLayout title="Next.js Demo">
      <PokemonFilter onFilter={filter}/>
      <PokemonList pokemons={pokemons}>
        {!inView && !filtered && <div className="ref" ref={ref}></div>}
      </PokemonList>
      {loading && <Spinner /> }
    </RootLayout>
  );
}
