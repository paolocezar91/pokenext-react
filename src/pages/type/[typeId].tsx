'use client';

import { idOrName } from "@/app/api-utils";
import { getAllTypes, getTypeById } from "@/app/services/type";
import PokemonDefensiveChart from "@/components/shared/defensive-chart";
import { PokemonOffensiveChart } from "@/components/shared/offensive-chart";
import Select from "@/components/shared/select";
import LoadingSpinner from "@/components/shared/spinner";
import { capitilize } from "@/components/shared/utils";
import MovesByType from "@/components/type/moves-by-type";
import PokemonByType from "@/components/type/pokemon-by-type";
import { useUser } from "@/context/user-context";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { IMove, INamedApiResource, IType } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import RootLayout from "../layout";

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.typeId);
  const vars = idOrName(id);
  try {
    const { pokemonType } = await getTypeById(vars);
    const { types } = await getAllTypes();
    return {
      props: {
        typeData: pokemonType,
        allTypes: types
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export async function getStaticPaths() {
  const allTypes = await getAllTypes();
  const ids = allTypes.types.reduce((acc, type) => {
    return [...acc, String(type.id), type.name];
  }, [] as string[]);

  return {
    paths: ids.map(typeId => ({ params: { typeId }})),
    fallback: true
  };
}

export default function TypeDetails({ typeData, allTypes }: { typeData: IType & { moves: INamedApiResource<IMove>[] }, allTypes: IType[] }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();
  const router = useRouter();

  if (!allTypes || !typeData || !settings) {
    return (
      <RootLayout title={`${t('pokedex.loading')}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RootLayout>
    );
  }

  const title = `${t('type.title')} - ${capitilize(typeData.name)}`;
  return <RootLayout title={title}>
    <div className="h-[inherit] p-4 bg-(--pokedex-red)">
      <div className="mx-auto p-4 bg-background rounded shadow-md h-[-webkit-fill-available] overflow-auto md:overflow-[initial]">
        <div className="flex items-center">
          <h2 className="w-fit text-xl font-semibold mb-2 mr-4">{title}</h2>
          <div className="grow"></div>
          <Select value={typeData.name} className="ml-4" onChange={(e) => router.push(`/type/${e.target.value}`)}>
            {allTypes.map((t, id) => {
              return <option key={id} value={t.name}>{capitilize(t.name)}</option>;
            })}
          </Select>
        </div>
        <div className="flex flex-col md:flex-row">
          <PokemonDefensiveChart types={[typeData.name]} name={typeData.name} />
          <PokemonOffensiveChart types={[typeData.name]} name={typeData.name} />
        </div>
        <div className="flex flex-col md:flex-row h-[58vh] overflow-[initial] md:overflow-auto mt-4 gap-2 md:gap-4">
          <div className="w-full md:w-1/2 md:h-[inherit] mb-2
          ">
            <PokemonByType pokemonList={typeData.pokemon} type={typeData.name}></PokemonByType>
          </div>
          <div className="w-full md:w-1/2 md:h-[inherit] mb-2
          ">
            <MovesByType movesList={typeData.moves} type={typeData.name}></MovesByType>
          </div>
        </div>
      </div>
    </div>
  </RootLayout>;
}