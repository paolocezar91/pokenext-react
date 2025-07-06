'use client';

import PokeApiQuery from '@/app/query';
import RootLayout from '@/pages/layout';
import All from '@/app/poke-array.json';
import { SpeciesChain } from '@/types/types';
import Controls from '@/components/[id]/controls';
import PokemonAbilities from '@/components/[id]/details/abilities';
import PokemonCries from '@/components/[id]/details/cries';
import PokemonDefensiveChart from '@/components/[id]/details/defensive-chart';
import PokemonDescription from '@/components/[id]/details/description';
import PokemonEvolutionChart from '@/components/[id]/details/evolution-chart/evolution-chart';
import PokemonFirstAppearance from '@/components/[id]/details/first-appearance';
import PokemonMoves from '@/components/[id]/details/moves';
import PokemonSize from '@/components/[id]/details/size';
import PokemonStats from '@/components/[id]/details/stats';
import PokemonTypes from '@/components/[id]/details/types';
import PokemonVarieties from '@/components/[id]/details/varieties';
import Spinner from '@/components/shared/spinner';
import PokemonThumb, { getNumber } from '@/components/shared/thumb/thumb';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IEvolutionChain, INamedApiResourceList, IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  capitilize,
  getIdFromUrlSubstring,
  normalizePokemonName
} from '../../../components/shared/utils';
import './index.scss';
import PokemonMisc from '@/components/[id]/details/misc';
import { useSnackbar } from '@/context/snackbar';

const pokeApiQuery = new PokeApiQuery();

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id);
  try {
    const pokemonData = await pokeApiQuery.getPokemon(id);
    const previousAndAfter = await pokeApiQuery.getPokemonList(3, pokemonData.id - 1 > 0 ? pokemonData.id - 2 : 0);
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
  const ids = Array.from({ length: 1025 }, (_, i) => String(i + 1));
  const all = All.map((pokemon) => pokemon.name);

  return {
    paths: [...all, ...ids].map(id => ({ params: { id }})),
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
  const [species, setSpecies] = useState<
    IPokemonSpecies &
    { is_legendary?: boolean; is_mythical?: boolean } | null
  >(null);
  const [types, setTypes] = useState<IType[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<IEvolutionChain | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const params = useParams();
  const currentId = !error ? id || params?.id : undefined;
  const { showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    if (!currentId) return;

    const setPokemonData = () => {
      setLoaded(false);

      speciesChain.loaded = false;
      speciesChain.chain = {};

      const getPokemonMetadata = async () => {
        showSnackbar('Loading...');
        const [speciesData, typesData] = await Promise.all([
          pokeApiQuery.getSpecies(getIdFromUrlSubstring(pokemonData.species.url)),
          pokeApiQuery.getTypes(pokemonData.types),
        ]);

        if(pokemonData) {
          setPokemon(pokemonData);
        }
        if(typesData.length) {
          setTypes(typesData);
        }
        if(speciesData) {
          setSpecies(speciesData);
          const ec = await pokeApiQuery.getEvolutionChain(speciesData) as IEvolutionChain;
          setEvolutionChain(ec);

          const evolve_to_id = getIdFromUrlSubstring(ec.chain.species.url);
          speciesChain.chain.first = [await pokeApiQuery.getPokemon(evolve_to_id)];
          if(ec.chain?.evolves_to?.[0]) {
            speciesChain.chain.second = await Promise.all(
              ec.chain.evolves_to.map((evolves_to) => {
                const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
                return pokeApiQuery.getPokemon(evolve_to_id);
              })
            );
            if(ec.chain.evolves_to[0].evolves_to[0]) {
              speciesChain.chain.third = await Promise.all(
                ec.chain.evolves_to[0].evolves_to.map((evolves_to) => {
                  const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
                  return pokeApiQuery.getPokemon(evolve_to_id);
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

      showSnackbar('Loading...');
      getPokemonMetadata();
      hideSnackbar();
    };

    setPokemonData();
  }, [currentId]);

  if(error)
    return <RootLayout title={`404 - ${t('pokedex.notFound')}`}>
      <div className="container p-4">
        <h2 className="w-fit border-b-2 border-solid border-white text-lg inline">404 - { t('pokedex.notFound') }</h2>
        <p className="pt-4 ml-4 flex align-center">
          <Link
            href='/'
            className="text-xs"
          >
            Return to list
            <ArrowUturnLeftIcon className="w-5 ml-2 inline" />
          </Link>
        </p>
      </div>
    </RootLayout>;

  return (
    <RootLayout title={
      pokemon ?
        `${normalizePokemonName(pokemon.name)} ${getNumber(pokemon.id)}` :
        `${t('pokedex.loading')}...`
    }>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto relative">
        {!loaded && <Spinner />}
        <Suspense>
          {loaded && <div className=" wrapper flex flex-col md:flex-row mx-auto p-4 bg-background rounded shadow-md h-[-webkit-fill-available]">
            <div className=" thumb flex flex-col h-[-webkit-fill-available] md:items-start mr-0 md:mr-4 self-center md:self-start"
            >
              <PokemonThumb pokemonData={pokemon} size="lg" showShinyCheckbox showName />
              <hr className="border-solid border-2 border-white mt-2 w-full" />
              <PokemonTypes types={types} />
              <PokemonCries pokemon={pokemon} />
              <div className="flex-1"></div>
              <Controls pokemon={pokemon} previousAndAfter={previousAndAfter} />
            </div>
            <div className="
              pokemon-details
              border-solid
              border-l-foreground
              mt-4
              px-4
              pb-4
              pt-0
              overflow-[initial]
              md:overflow-auto
              md:mt-0
              md:border-l-4
              md:my-0
              sm:my-4
              sm:border-0
            ">
              <div className="about grid grid-cols-1 md:grid-cols-6 gap-2">
                {species && <PokemonDescription species={species} />}
                <PokemonFirstAppearance pokemon={pokemon} species={species as IPokemonSpecies} />
                <PokemonSize pokemon={pokemon} />
                <PokemonAbilities pokemon={pokemon} />
                {species && <PokemonMisc species={species} />}
                <PokemonStats pokemon={pokemon} />
                <PokemonDefensiveChart name={capitilize(pokemon.name)} types={types.map(type => type.name)} />
                { species && species.varieties.length > 1 &&
                  <PokemonVarieties name={pokemon.name} species={species} />}
                { evolutionChain &&
                  <PokemonEvolutionChart pokemon={pokemon} speciesChain={speciesChain} evolutionChain={evolutionChain} />}
                <PokemonMoves pokemon={pokemon} />
              </div>
            </div>
          </div>}
        </Suspense>
      </div>
    </RootLayout>
  );
}