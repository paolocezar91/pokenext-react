import { idOrName } from "@/app/api/api-utils";
import PokeApiQuery from "@/app/api/poke-api-query";
import { getAllMoves, getMoveById } from "@/app/services/move";
import FlavorText from "@/components/moves/flavor-text";
import LearnedByPokemon from "@/components/moves/learned-by-pokemon";
import MoveDataTable from "@/components/moves/move-data-table";
import MoveEffect from "@/components/moves/move-effect";
import MoveTarget from "@/components/moves/move-target";
import LoadingSpinner from "@/components/shared/spinner";
import RootLayout from "@/pages/[locale]/layout";
import { useQuery } from "@tanstack/react-query";
import { GetStaticPropsContext } from "next";
import { IMove, INamedApiResource, IPokemon } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import { capitilize, getIdFromUrlSubstring, kebabToSpace } from "@/components/shared/utils";
import { locales } from "@/i18n/config";

const pokeApiQuery = new PokeApiQuery();
type MoveData = IMove & { learned_by_pokemon: INamedApiResource<IPokemon>[] };

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.moveId);
  try {
    const moveData = (await getMoveById(idOrName(id))).moveById as MoveData;
    return {
      props: {
        moveData,
        locale: context.params?.locale,
        messages: (await import(`@/locales/${context.params?.locale}/common.json`)).default
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export async function getStaticPaths() {
  const moves = await getAllMoves();
  const ids = moves.results.reduce((acc, move) => {
    return [...acc, String(move.id), move.name];
  }, [] as string[]);

  const paths = [];
  for (const locale of locales) {
    for (const moveId of ids) {
      paths.push({ params: { locale, moveId } });
    }
  }

  return {
    paths,
    fallback: true
  };
}

export default function MoveDetails({ moveData }: { moveData: MoveData }) {
  const t = useTranslations();
  const { data: targetData } = useQuery({
    queryKey: ['moveData.target.url', moveData.target.url],
    queryFn: () => pokeApiQuery.getMoveTarget(getIdFromUrlSubstring(moveData.target.url)),
  });

  if (!moveData || !targetData) {
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
              <MoveTarget targetData={targetData} />
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