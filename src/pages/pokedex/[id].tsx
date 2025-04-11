'use client';

import { fetchEvolutionChain, fetchPokemon, fetchSpecies, fetchTypes } from '@/app/api';
import RootLayout from '@/app/layout';
import { SpeciesChain } from '@/app/types';
import PokemonAbilities from '@/components/details/abilities';
import PokemonCries from '@/components/details/cries';
import PokemonDescription from '@/components/details/description';
import PokemonEvolutionChart from '@/components/details/evolution-chart/evolution-chart';
import PokemonStats from '@/components/details/stats';
import PokemonSize from '@/components/details/size';
import PokemonTypes from '@/components/details/types';
import Spinner from '@/components/spinner/spinner';
import PokemonThumb, { getNumber } from '@/components/thumb/thumb';
import { GetStaticPropsContext } from 'next';
import { useParams } from 'next/navigation';
import PokeAPI, { IEvolutionChain, INamedApiResourceList, IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Controls from '../../components/controls';
import './[id].scss';

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id);
  try {
    const pokemonData = await PokeAPI.Pokemon.resolve(id);
    const previousAndAfter = await(PokeAPI.Pokemon.list(3, pokemonData.id - 1 > 0 ? pokemonData.id - 2 : 0));
    return {
      props: {
        id: pokemonData.id,
        pokemonData,
        previousAndAfter
      }
    };
  } catch (error) {
    console.error(error);
  }
}

export function capitilize(s: string) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

export function getStaticPaths() {
  const ids = Array.from({length: 1025}, (_, i) => String(i + 1));

  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: true
  };
}

export default function PokemonDetails({
  id,
  pokemonData,
  previousAndAfter
}: {
  id: string,
  pokemonData: IPokemon,
  previousAndAfter: INamedApiResourceList<IPokemon>
}) {
  const [pokemon, setPokemon] = useState<IPokemon>(pokemonData);
  const [speciesChain, setSpeciesChain] = useState<SpeciesChain>({ loaded: false, chain: {}});
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [types, setTypes] = useState<IType[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<IEvolutionChain | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  console.log(previousAndAfter);

  const { t } = useTranslation();

  const params = useParams();
  const currentId = id || params?.id;

  useEffect(() => {
    if (!currentId) return;

    const setPokemonData = () => {
      setLoaded(false);

      speciesChain.loaded = false;
      speciesChain.chain = {};

      const getPokemonMetadata = async () => {
        const [speciesData, typesData] = await Promise.all([
          fetchSpecies(String(pokemonData.id)),
          fetchTypes(pokemonData.types),
        ]);

        if(pokemonData) setPokemon(pokemonData);
        if(typesData.length) setTypes(typesData);
        if(speciesData) {
          setSpecies(speciesData);
          const evolutionChain = await fetchEvolutionChain(speciesData) as IEvolutionChain;
          setEvolutionChain(evolutionChain);

          speciesChain.chain.first = [await fetchPokemon(evolutionChain.chain.species.name)];
          if(evolutionChain.chain?.evolves_to?.[0]) {
            speciesChain.chain.second = await Promise.all(
              evolutionChain.chain.evolves_to.map((evolves_to) => {
                return fetchPokemon(evolves_to.species.name);
              })
            );
            if(evolutionChain.chain.evolves_to[0].evolves_to[0]) {
              speciesChain.chain.third = await Promise.all(
                evolutionChain.chain.evolves_to[0].evolves_to.map((evolves_to) => {
                  return fetchPokemon(evolves_to.species.name);
                })
              );
            } else {
              speciesChain.chain.third = [];
            }
          } else {
            speciesChain.chain.second = [];
            speciesChain.chain.third = [];
          }
          speciesChain.loaded = true;
          setSpeciesChain(speciesChain);
          setLoaded(true);
        }
      };

      getPokemonMetadata();
    };

    setPokemonData();
  }, [currentId]);

  return (
    <RootLayout title={pokemon ? `${capitilize(pokemon.name)} - #${getNumber(pokemon.id)}` : `${t('pokedex.loading')}...`}>
      {!loaded && <Spinner />}
      <Suspense>
        {loaded && <div className="mx-auto p-4">
          <div className="flex sm:flex-col md:flex-row">
            <div className="thumb flex flex-col md:items-start mr-4 sm:self-center md:self-start">
              <PokemonThumb pokemonData={pokemon} size="large" shinyInput={true}/>
              <hr className="border-solid border-2 border-(--pokedex-red-light) mt-2 w-full" />
              <PokemonTypes types={types} />
              <PokemonCries pokemon={pokemon} />
            </div>
            <div className="pokemon-details sm:mt-4 sm:mb-4 md:mt-0 p-6 bg-white rounded-lg shadow-md">
              <div className="about grid grid-cols-1 md:grid-cols-2 gap-4">
                {species && <PokemonDescription species={species} />}
                <PokemonSize pokemon={pokemon} />
                <PokemonAbilities pokemon={pokemon} />
                <PokemonStats pokemon={pokemon} />
                { evolutionChain && <PokemonEvolutionChart speciesChain={speciesChain} evolutionChain={evolutionChain} />}
              </div>
            </div>
          </div>
          <Controls pokemon={pokemon} previousAndAfter={previousAndAfter} />
        </div>}
      </Suspense>
    </RootLayout>
  );
}