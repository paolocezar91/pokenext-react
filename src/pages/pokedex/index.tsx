'use client';

import { fetchPokemonDataList, fetchPokemonList } from '@/app/api';
import '@/app/globals.css';
import RootLayout from '@/app/layout';
import { IPkmn } from '@/app/types';
import PokemonFilter from '@/components/list/filter';
import PokemonList from '@/components/list/list';
import Spinner from '@/components/spinner/spinner';
import PokemonTable from '@/components/table/table';
import Toggle from '@/components/toggle';
import Tooltip from '@/components/tooltip/tooltip';
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [listTableToggle, setListTableToggle] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [offset, setOffset] = useState(STARTING_POKEMON + NUMBERS_OF_POKEMON);
  const {t} = useTranslation('common');

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
        const value = filterText.toLowerCase();

        return pkmn.name.toLowerCase().includes(filterText.toLowerCase()) ||
          pkmn.types[0].type.name === value ||
          pkmn.types[1]?.type?.name === value;
      }));
    } else {
      setPokemons(pokemonsBackup);
    }
  };

  if (!pokemons) return null;

  return (
    <RootLayout title="Next.js Demo">
      <div className="wrapper p-4">
        <div className="flex items-center bg-(--pokedex-red) p-4 w-max border-b-2 border-solid border-black rounded-t-lg">
          <PokemonFilter onFilter={filter} />
          <div className="flex ml-4">
            <Tooltip content={t('pokedex.listOrTable')}>
              <div className="flex">
                <Squares2X2Icon className="w-7 mr-3" />
                <Toggle value={listTableToggle} onChange={(value: boolean) => setListTableToggle(value)} />
                <TableCellsIcon className="w-7" />
              </div>
            </Tooltip>
          </div>
        </div>
        {
          !listTableToggle ?
            <PokemonList pokemons={pokemons}>
              {!inView && !filtered && <div className="ref" ref={ref}></div>}
            </PokemonList> :
            <PokemonTable pokemons={pokemons}>
              {!inView && !filtered && <div className="ref" ref={ref}></div>}
            </PokemonTable>
        }
        {loading && <Spinner /> }
      </div>
    </RootLayout>
  );
}
