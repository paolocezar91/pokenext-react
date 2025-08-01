'use client';

import PokeApiQuery from "@/app/poke-api-query";
import FlavorText from "@/components/moves/flavor-text";
import LearnedByPokemon from "@/components/moves/learned-by-pokemon";
import MoveDataTable from "@/components/moves/move-data-table";
import MoveEffect from "@/components/moves/move-effect";
import MoveTarget from "@/components/moves/move-target";
import LoadingSpinner from "@/components/shared/spinner";
import RootLayout from "@/pages/layout";
import { GetStaticPropsContext } from "next";
import { IMove, INamedApiResource, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import { capitilize, getIdFromUrlSubstring, kebabToSpace, useAsyncQuery } from "../../components/shared/utils";

const pokeApiQuery = new PokeApiQuery();
type MoveData = IMove & { learned_by_pokemon: INamedApiResource<IPokemon>[] };

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.moveId);
  try {
    const moveData = await pokeApiQuery.getMove(id) as MoveData;
    return {
      props: {
        moveData
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export async function getStaticPaths() {
  const moves = await pokeApiQuery.getMoves();
  const ids = moves.results.reduce((acc, move) => {
    return [...acc, String(move.id), move.name];
  }, [] as string[]);

  return {
    paths: ids.map(moveId => ({ params: { moveId }})),
    fallback: true
  };
}

export default function MoveDetails({ moveData }: { moveData: MoveData }) {
  const { t } = useTranslation('common');
  const { data: targetData } = useAsyncQuery(
    () => pokeApiQuery.getMoveTarget(getIdFromUrlSubstring(moveData.target.url)),
    [moveData.target.url]
  );

  if (!moveData) {
    return (
      <RootLayout title={`${t('pokedex.loading')}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RootLayout>
    );
  }

  const title = `${t('moves.title')} - ${capitilize(kebabToSpace(moveData.name))}`;
  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
        <div className="mx-auto px-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available] flex flex-col">
          <div className="flex items-center mt-4">
            <h2 className="w-fit text-xl font-semibold mb-2 mr-4">{title}</h2>
          </div>
          <div className="flex flex-col md:flex-row">

            {/* Left Column */}
            <div className="flex flex-col w-full md:w-150 h-[-webkit-fill-available] md:items-start mt-4 mr-0 md:mr-4 self-center md:self-start">
              <MoveEffect moveData={moveData} />
              <FlavorText moveData={moveData} />
              <MoveDataTable moveData={moveData} />
              {targetData && <MoveTarget targetData={targetData} />}
            </div>
            {/* Right Column */}
            <div className="w-full h-[-webkit-fill-available] md:pl-8 mr-0 md:mr-4 mt-4 md:mt-0">
              <LearnedByPokemon pokemonList={moveData.learned_by_pokemon} />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}