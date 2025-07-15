import PokeApiQuery from "@/app/query";
import RootLayout from "@/pages/layout";
import { GetStaticPropsContext } from "next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IMove, IMoveTarget, INamedApiResource, IPokemon } from "pokeapi-typescript";
import FlavorText from "@/components/moves/flavor-text";
import MoveDataTable from "@/components/moves/move-data-table";
import MoveTarget from "@/components/moves/move-target";
import MoveEffect from "@/components/moves/move-effect";
import LearnedByPokemon from "@/components/moves/learned-by-pokemon";
import { capitilize, getIdFromUrlSubstring, kebabToSpace } from "../../components/shared/utils";

const pokeApiQuery = new PokeApiQuery();

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.moveId);
  try {
    const moveData = await pokeApiQuery.getMove(id) as IMove & { learned_by_pokemon: INamedApiResource<IPokemon>[] };
    return {
      props: {
        moveData: {
          ...moveData,
          learned_by_pokemon: moveData.learned_by_pokemon.filter((pkmn) => Number(getIdFromUrlSubstring(pkmn.url)) <= 1025)
        },
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export function getStaticPaths() {
  const ids = Array.from({ length: 1025 }, (_, i) => String(i + 1));

  return {
    paths: ids.map(moveId => ({ params: { moveId }})),
    fallback: true
  };
}

export default function MoveDetails({
  moveData
}: {
  moveData: IMove & { learned_by_pokemon: INamedApiResource<IPokemon>[] }
}) {
  const [targetData, setTargetData] = useState<IMoveTarget | null>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    const getTarget = async () => {
      if (moveData?.target) {
        setTargetData(await pokeApiQuery.getURL<IMoveTarget>(moveData.target.url));
      }
    };
    getTarget();
  }, [moveData]);

  if (!moveData) {
    return (
      <RootLayout title={`${t('pokedex.loading')}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <p>{t('pokedex.loading')}...</p>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout title={`${t('moves.title')} - ${capitilize(kebabToSpace(moveData.name))}`}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
        <div className="mx-auto p-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available] flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="sm:w-auto md:w-150 flex flex-col h-[-webkit-fill-available] md:items-start mr-0 md:mr-4 self-center md:self-start">
            <FlavorText moveData={moveData} />
            <MoveDataTable moveData={moveData} />
            {targetData && <MoveTarget targetData={targetData} />}
          </div>

          {/* Right Column */}
          <div className="w-full h-[-webkit-fill-available] flex flex-col md:items-start pl-8 mr-0 md:mr-4 self-center md:self-start mt-4 md:mt-0">
            <MoveEffect moveData={moveData} />
            <LearnedByPokemon learnedByPokemon={moveData.learned_by_pokemon} />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}