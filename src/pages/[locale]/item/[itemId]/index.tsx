import { idOrName } from "@/app/api/api-utils";
import { getAllItem, getItemById } from "@/app/services/item";
import ItemDescription from "@/components/items/[id]/description";
import ItemFlavorText from "@/components/items/[id]/flavor-text";
import HeldByPokemon from "@/components/items/[id]/held-by-pokemon";
import ItemMisc from "@/components/items/[id]/misc";
import ItemTable from "@/components/items/[id]/table";
import RootLayout from "@/components/layout/layout";
import LoadingSpinner from "@/components/shared/spinner";
import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Item } from "pokeapi-typescript";

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.itemId);
  const vars = idOrName(id);
  try {
    const itemData = (await getItemById(vars)).itemById;

    return {
      props: {
        id: itemData.id,
        itemData,
        locale: context.params?.locale,
        messages: await getMessages(String(context.params?.locale)),
      },
    };
  } catch (error) {
    return { props: error };
  }
}

export async function getStaticPaths() {
  const items = await getAllItem({ limit: 50 });
  const ids = items.results.reduce((acc, move) => {
    return [...acc, String(move.id), move.name];
  }, [] as string[]);

  const paths = [];
  for (const locale of locales) {
    for (const itemId of ids) {
      paths.push({ params: { locale, itemId }});
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export default function ItemDetails({ itemData }: { itemData: Item }) {
  const t = useTranslations();

  if (!itemData) {
    return (
      <RootLayout title={`${t("pokedex.loading")}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RootLayout>
    );
  }

  const title = `${t("items.title")} - ${capitilize(
    kebabToSpace(itemData.name)
  )}`;

  return (
    <RootLayout title={title}>
      <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
        <div className="mx-auto px-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available] flex">
          <div className="list w-1/3 m-4 ml-0 pr-4 overflow-auto h-[full]">
            <ItemTable />
          </div>
          <div className="show w-2/3">
            <div className="flex items-center mt-4">
              <h2 className="w-fit text-xl font-semibold mb-2 mr-4">{title}</h2>
              {itemData.sprites.default &&
                <Image
                  className="mr-2"
                  src={itemData.sprites.default}
                  alt={itemData.name}
                  width={48}
                  height={48}
                />
              }
            </div>
            <ItemFlavorText item={itemData} />
            <ItemDescription item={itemData} />
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-wrap gap-2 w-full h-[-webkit-fill-available] md:items-start mt-4 mr-0 md:mr-4 self-center md:self-start">
                <ItemMisc item={itemData} />
              </div>
              <div className="w-full h-[-webkit-fill-available] md:pl-8 mr-0 md:mr-4 mt-4 md:mt-0">
                <HeldByPokemon pokemonList={itemData.held_by_pokemon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
