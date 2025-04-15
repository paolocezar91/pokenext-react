'use client';

import { fetchEvolutionChain, fetchPokemon, fetchSpecies, fetchTypes } from '@/app/api';
import RootLayout from '@/app/layout';
import { SpeciesChain } from '@/app/types';
import PokemonAbilities from '@/components/details/abilities';
import PokemonCries from '@/components/details/cries';
import PokemonDescription from '@/components/details/description';
import PokemonEvolutionChart from '@/components/details/evolution-chart/evolution-chart';
import PokemonMoves from '@/components/details/moves';
import PokemonSize from '@/components/details/size';
import PokemonStats from '@/components/details/stats';
import PokemonTypes from '@/components/details/types';
import PokemonVarieties from '@/components/details/varieties';
import Spinner from '@/components/spinner/spinner';
import PokemonThumb, { getNumber } from '@/components/thumb/thumb';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PokeAPI, { IEvolutionChain, INamedApiResourceList, IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Controls from '../../components/controls';
import './[id].scss';
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from './utils';
import PokemonDefensiveChart from '@/components/details/defensive-chart';

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id);
  try {
    const pokemonData = await fetchPokemon(id);
    const previousAndAfter = await PokeAPI.Pokemon.list(3, pokemonData.id - 1 > 0 ? pokemonData.id - 2 : 0);
    return {
      props: {
        id: pokemonData.id,
        pokemonData,
        previousAndAfter
      }
    };
  } catch (error) {
    return { props: error };
  }
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
  previousAndAfter,
  error
}: {
  id: string,
  pokemonData: IPokemon,
  previousAndAfter: INamedApiResourceList<IPokemon>,
  error?: { statusText: string, status: number }
}) {
  const [pokemon, setPokemon] = useState<IPokemon>(pokemonData);
  const [speciesChain, setSpeciesChain] = useState<SpeciesChain>({ loaded: false, chain: {}});
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [types, setTypes] = useState<IType[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<IEvolutionChain | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { t } = useTranslation();
  const params = useParams();
  const currentId = !error ? id || params?.id : undefined;

  useEffect(() => {
    if (!currentId) return;

    const setPokemonData = () => {
      setLoaded(false);

      speciesChain.loaded = false;
      speciesChain.chain = {};

      const getPokemonMetadata = async () => {
        const [speciesData, typesData] = await Promise.all([
          fetchSpecies(getIdFromUrlSubstring(pokemonData.species.url)),
          fetchTypes(pokemonData.types),
        ]);

        if(pokemonData) {
          setPokemon(pokemonData);
        }
        if(typesData.length) {
          setTypes(typesData);
        }
        if(speciesData) {
          setSpecies(speciesData);
          const ec = await fetchEvolutionChain(speciesData) as IEvolutionChain;
          setEvolutionChain(ec);

          const evolve_to_id = getIdFromUrlSubstring(ec.chain.species.url);
          speciesChain.chain.first = [await fetchPokemon(evolve_to_id)];
          if(ec.chain?.evolves_to?.[0]) {
            speciesChain.chain.second = await Promise.all(
              ec.chain.evolves_to.map((evolves_to) => {
                const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
                return fetchPokemon(evolve_to_id);
              })
            );
            if(ec.chain.evolves_to[0].evolves_to[0]) {
              speciesChain.chain.third = await Promise.all(
                ec.chain.evolves_to[0].evolves_to.map((evolves_to) => {
                  const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
                  return fetchPokemon(evolve_to_id);
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

  if(error)
    return <RootLayout title={`404 - ${t('pokedex.notFound')}`}>
      <div className="container p-4">
        <h2 className="border-b-2 border-solid border-white text-lg inline">404 - { t('pokedex.notFound') }</h2>
        <p className="pt-4 ml-4 flex align-center">
          <Link
            href='/pokedex/'
            className="text-xs"
          >
            Return to list
            <ArrowUturnLeftIcon className="w-5 ml-2 inline" />
          </Link>
        </p>
      </div>
    </RootLayout>;

  return (
    <RootLayout title={pokemon ? `${normalizePokemonName(pokemon.name)} - #${getNumber(pokemon.id)}` : `${t('pokedex.loading')}...`}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto md:overflow-[initial]">
        {!loaded && <Spinner />}
        <Suspense>
          {loaded && <div className="mx-auto p-4 bg-background rounded shadow-md h-[-webkit-fill-available]">
            <div className="flex flex-col md:flex-row h-[-webkit-fill-available]">
              <div className="thumb flex flex-col h-[-webkit-fill-available] md:items-start mr-0 md:mr-4 self-center md:self-start">
                <PokemonThumb pokemonData={pokemon} size="large" hasShinyCheckbox={true}/>
                <hr className="border-solid border-2 border-white mt-2 w-full" />
                <PokemonTypes types={types} />
                <PokemonCries pokemon={pokemon} />
                <div className="flex-1"></div>
                <Controls pokemon={pokemon} previousAndAfter={previousAndAfter} />
              </div>
              <div className="pokemon-details sm:border-0 md:border-l-4 border-solid border-l-white sm:mt-4 sm:mb-4 md:mt-0 md:mb-0 p-4 pt-0">
                <div className="about grid grid-cols-1 md:grid-cols-2 gap-4">
                  {species && <PokemonDescription species={species} />}
                  <PokemonSize pokemon={pokemon} />
                  <PokemonAbilities pokemon={pokemon} />
                  <PokemonStats pokemon={pokemon} />
                  <PokemonDefensiveChart name={capitilize(pokemon.name)} types={types.map(type => type.name)} />
                  { species && species.varieties.length > 1 && <PokemonVarieties name={pokemon.name} species={species} />}
                  { evolutionChain && !!speciesChain.chain.second.length &&
                    <PokemonEvolutionChart speciesChain={speciesChain} evolutionChain={evolutionChain} />}
                  <PokemonMoves pokemon={pokemon} />
                </div>
              </div>
            </div>
          </div>}
        </Suspense>
      </div>
    </RootLayout>
  );
}