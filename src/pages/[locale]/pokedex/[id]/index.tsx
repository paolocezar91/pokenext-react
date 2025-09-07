import { idOrName } from '@/app/api/api-utils';
import PokeApiQuery from '@/app/api/poke-api-query';
import { NUMBERS_OF_POKEMON } from '@/app/const';
import { getAllPokemon, getPokemonById } from '@/app/services/pokemon';
import Controls from '@/components/pokedex/[id]/controls';
import PokemonAbilities from '@/components/pokedex/[id]/details/abilities';
import PokemonCries from '@/components/pokedex/[id]/details/cries';
import PokemonDescription from '@/components/pokedex/[id]/details/description';
import PokemonEvolutionChart from '@/components/pokedex/[id]/details/evolution-chart/evolution-chart';
import PokemonFirstAppearance from '@/components/pokedex/[id]/details/first-appearance';
import PokemonGender from '@/components/pokedex/[id]/details/gender';
import PokemonMisc from '@/components/pokedex/[id]/details/misc';
import PokemonMoves from '@/components/pokedex/[id]/details/moves';
import PokemonSize from '@/components/pokedex/[id]/details/size';
import PokemonStats from '@/components/pokedex/[id]/details/stats';
import PokemonTypes from '@/components/pokedex/[id]/details/types';
import PokemonVarieties from '@/components/pokedex/[id]/details/varieties';
import PokemonDefensiveChart from '@/components/shared/defensive-chart';
import PokemonThumb, { getNumber } from '@/components/shared/thumb/thumb';
import { locales } from '@/i18n/config';
import RootLayout from '@/pages/[locale]/layout';
import { SpeciesChain } from "@/types/types";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IEvolutionChain, INamedApiResourceList, IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { useEffect, useReducer } from 'react';
import {
  capitilize,
  getIdFromUrlSubstring,
  normalizePokemonName
} from '../../../../components/shared/utils';
import './index.scss';
import { getMessages } from '@/i18n/messages';

const pokeApiQuery = new PokeApiQuery();

export type PokemonState = {
  pokemon: IPokemon;
  speciesChain: SpeciesChain;
  species: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean } | null;
  types: IType[];
  evolutionChain: IEvolutionChain | null;
};

export type PokemonAction =
  | { type: 'SET_POKEMON'; payload: IPokemon }
  | { type: 'SET_SPECIES_CHAIN'; payload: SpeciesChain }
  | { type: 'SET_SPECIES'; payload: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean }}
  | { type: 'SET_TYPES'; payload: IType[] }
  | { type: 'SET_EVOLUTION_CHAIN'; payload: IEvolutionChain }
  | { type: 'RESET_STATE' };

export async function generateSpeciesEvolutionChain(ec: IEvolutionChain): Promise<SpeciesChain> {
  const evolve_to_id = getIdFromUrlSubstring(ec.chain.species.url);
  const chain: { first: IPokemon[], second: IPokemon[], third: IPokemon[] } = {
    first: [await pokeApiQuery.getPokemonById(evolve_to_id)],
    second: [],
    third: [],
  };

  const secondEvo = ec.chain?.evolves_to?.[0];
  if(secondEvo) {
    chain.second = await Promise.all(
      ec.chain.evolves_to.map((evolves_to) => {
        const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
        return pokeApiQuery.getPokemonById(evolve_to_id);
      })
    );

    if(secondEvo.evolves_to[0]) {
      chain.third = await Promise.all(
        secondEvo.evolves_to.map((evolves_to) => {
          const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
          return pokeApiQuery.getPokemonById(evolve_to_id);
        })
      );
    }
  }

  return { loaded: true, chain };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id);
  const vars = idOrName(id);
  try {
    const pokemonData = (await getPokemonById(vars)).pokemonById;
    const previousAndAfter = await getAllPokemon({ offset: pokemonData.id - 1 > 0 ? pokemonData.id - 2 : 0, limit: 3 });
    return {
      props: {
        id: pokemonData.id,
        pokemonData,
        previousAndAfter,
        locale: context.params?.locale,
        messages: await getMessages(String(context.params?.locale))
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export async function getStaticPaths() {
  const pkmns = await getAllPokemon({ limit: NUMBERS_OF_POKEMON, offset: 0 });
  const ids = pkmns.results.reduce((acc, pkmn) => {
    return [...acc, String(pkmn.id), pkmn.name];
  }, [] as string[]);

  // Generate all combinations of locale and id
  const paths = [];
  for (const locale of locales) {
    for (const id of ids) {
      paths.push({ params: { locale, id }});
    }
  }

  return {
    paths,
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
  const initialState: PokemonState = {
    pokemon: pokemonData,
    speciesChain: { loaded: false, chain: {}},
    species: null,
    types: [],
    evolutionChain: null,
  };

  const pokemonReducer = (state: PokemonState, action: PokemonAction): PokemonState => {
    switch (action.type) {
      case 'SET_POKEMON':
        return { ...state, pokemon: action.payload };
      case 'SET_SPECIES_CHAIN':
        return { ...state, speciesChain: action.payload };
      case 'SET_SPECIES':
        return { ...state, species: action.payload };
      case 'SET_TYPES':
        return { ...state, types: action.payload };
      case 'SET_EVOLUTION_CHAIN':
        return { ...state, evolutionChain: action.payload };
      case 'RESET_STATE':
        return initialState;
      default:
        return state;
    }
  };

  const t = useTranslations();
  const params = useParams();
  const currentId = !error ? id || params?.id : undefined;
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  useEffect(() => {
    if (!currentId) return;

    const getPokemonMetadata = async () => {
      dispatch({ type: 'SET_POKEMON', payload: pokemonData });

      const [speciesData, typesData] = await Promise.all([
        pokeApiQuery.getSpecies(getIdFromUrlSubstring(pokemonData.species.url)),
        pokeApiQuery.getTypes(pokemonData.types),
      ]);

      dispatch({ type: 'SET_TYPES', payload: typesData });
      dispatch({ type: 'SET_SPECIES', payload: speciesData });

      const ec = await pokeApiQuery.getEvolutionChain(getIdFromUrlSubstring(speciesData.evolution_chain.url)) as IEvolutionChain;

      dispatch({ type: 'SET_EVOLUTION_CHAIN', payload: ec });
      dispatch({ type: 'SET_SPECIES_CHAIN', payload: await generateSpeciesEvolutionChain(ec) });
    };

    dispatch( { type: 'RESET_STATE' });
    getPokemonMetadata();
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

  const title = !state.pokemon ? `${t('pokedex.loading')}...` : `${normalizePokemonName(state.pokemon.name)} ${getNumber(state.pokemon.id)}`;

  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) overflow-auto relative">
        <div className=" wrapper flex flex-col md:flex-row mx-auto p-4 bg-background rounded shadow-md h-[-webkit-fill-available]">
          <div className=" thumb flex flex-col h-[-webkit-fill-available] md:items-start mr-0 md:mr-4 self-center md:self-start">
            <PokemonThumb pokemonData={state.pokemon} size="lg" showShinyCheckbox showName />
            <hr className="border-solid border-2 border-white mt-2 w-full" />
            <PokemonTypes types={state.types} />
            <PokemonCries pokemon={state.pokemon} />
            <div className="flex-1"></div>
            <Controls pokemon={state.pokemon} previousAndAfter={previousAndAfter} />
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
              <PokemonDescription pokemon={state.pokemon} species={state.species} />
              <div className="col-span-6 flex flex-wrap gap-4">
                <PokemonFirstAppearance pokemon={state.pokemon} species={state.species as IPokemonSpecies} />
                <PokemonSize pokemon={state.pokemon} />
                <PokemonGender species={state.species} />
                <PokemonAbilities pokemon={state.pokemon} />
                <PokemonMisc species={state.species} />
              </div>
              <PokemonStats pokemon={state.pokemon} />
              <PokemonDefensiveChart name={state.pokemon ? capitilize(state.pokemon.name) : ''} types={state.types.map(type => type.name)} />
              { state.species && state.species.varieties.length > 1 &&
                <PokemonVarieties name={state.pokemon.name} species={state.species} />}
              <PokemonEvolutionChart
                pokemon={state.pokemon}
                speciesChain={state.speciesChain}
                evolutionChain={state.evolutionChain} />
              <PokemonMoves pokemon={state.pokemon} />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}