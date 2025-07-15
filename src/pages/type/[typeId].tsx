import PokeApiQuery from "@/app/query";
import PokemonDefensiveChart from "@/components/shared/defensive-chart";
import { PokemonOffensiveChart } from "@/components/shared/offensive-chart";
import { capitilize, getIdFromUrlSubstring } from "@/components/shared/utils";
import MoveByType from "@/components/type/move-by-type";
import PokemonByType from "@/components/type/pokemon-by-type";
import { GetStaticPropsContext } from "next";
import { IType } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import RootLayout from "../layout";
import Image from "next/image";
import { getTypeIconById } from "@/components/[id]/details/types";
import { useUser } from "@/context/user-context";
import Select from "@/components/shared/select";
import { useRouter } from "next/router";

const pokeApiQuery = new PokeApiQuery();

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.typeId);
  try {
    const typeData = await pokeApiQuery.getType(id) as IType;
    const allTypes = await pokeApiQuery.getAllTypes() as IType[];
    return {
      props: {
        typeData,
        allTypes
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export function getStaticPaths() {
  const ids = Array.from({ length: 18 }, (_, i) => String(i + 1));

  return {
    paths: ids.map(typeId => ({ params: { typeId }})),
    fallback: true
  };
}

export default function TypeDetails({ typeData, allTypes }: { typeData: IType, allTypes: IType[] }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();
  const router = useRouter();

  if (!typeData || !settings) {
    return (
      <RootLayout title={`${t('pokedex.loading')}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <p>{t('pokedex.loading')}...</p>
        </div>
      </RootLayout>
    );
  }

  return <RootLayout title={`${t('type.title')} "${capitilize(typeData.name)}"`}>
    <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
      <div className="mx-auto p-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available]">
        <div className="flex items-center">
          <h2 className="w-fit text-xl font-semibold mb-2 mr-4">{capitilize(typeData.name)}</h2>
          <Image
            loading="lazy"
            width="100"
            height="20"
            alt={typeData.name}
            src={getTypeIconById(String(typeData.id), settings.typeArtworkUrl)} />
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
        <div className="flex flex-col md:flex-row">
          <div className="
            sm:w-auto
            md:w-1/3
            flex
            flex-col
            md:items-start
            mr-0
            md:mr-4
            self-center
            md:self-start
            mt-4
            md:mt-0"
          >
            <MoveByType movesList={typeData.moves}></MoveByType>
          </div>
          <div className="
            sm:w-auto
            md:w-2/3
            flex
            flex-col
            md:items-start
            mr-0
            md:mr-4
            self-center
            md:self-start
          ">
            <PokemonByType pokemonList={typeData.pokemon.map(p => p.pokemon)}></PokemonByType>
          </div>
        </div>
      </div>
    </div>
  </RootLayout>;
}