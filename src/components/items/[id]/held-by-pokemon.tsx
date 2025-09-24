import PokeApiQuery from "@/app/api/poke-api-query";
import { NUMBERS_OF_POKEMON } from "@/app/const";
import { getTypeIconById } from "@/components/pokedex/[id]/details/types";
import Link from "@/components/shared/link";
import SkeletonBlock from "@/components/shared/skeleton-block";
import SkeletonImage from "@/components/shared/skeleton-image";
import SortButton from "@/components/shared/table/sort-button";
import {
  SortingDir,
  SortMapping,
  sortResources,
  updateSortKeys,
} from "@/components/shared/table/sorting";
import Table from "@/components/shared/table/table";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import Tooltip from "@/components/shared/tooltip/tooltip";
import {
  capitilize,
  getIdFromUrlSubstring,
  normalizePokemonName,
} from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IPkmn } from "@/types/types";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IItemHolderPokemon } from "pokeapi-typescript";
import { useState } from "react";

export type SortKey = "id" | "name" | "types";
const pokeApiQuery = new PokeApiQuery();

export default function HeldByPokemon({
  pokemonList,
}: {
  pokemonList: IItemHolderPokemon[];
}) {
  const t = useTranslations();
  const { settings } = useUser();
  const [sorting, setSorting] = useState<SortingDir<SortKey>[]>([]);
  const toggleSort = (key: SortKey) => {
    setSorting((prev) => updateSortKeys(prev, key));
  };

  const ids = pokemonList
    .map((p) => Number(getIdFromUrlSubstring(p.pokemon.url)))
    .filter((id) => id < NUMBERS_OF_POKEMON);

  const { data: heldBy } = useQuery({
    queryKey: ["pokemonList", pokemonList],
    queryFn: () =>
      !ids.length
        ? []
        : pokeApiQuery
            .getPokemonByIds(ids, NUMBERS_OF_POKEMON)
            .then(({ results }) => results),
  });

  const tableHeaders = (
    <>
      <th className="bg-(--pokedex-red-dark) w-[5%]"></th>
      <th className="bg-(--pokedex-red-dark) w-[1%] text-white text-center px-2 py-1">
        <SortButton
          attr="id"
          onClick={() => toggleSort("id")}
          sorting={sorting}
        >
          #
        </SortButton>
      </th>
      <th className="bg-(--pokedex-red-dark) w-[15%] text-white text-left px-2 py-1">
        <SortButton
          attr="name"
          onClick={() => toggleSort("name")}
          sorting={sorting}
        >
          {t("table.name")}
        </SortButton>
      </th>
      <th className="bg-(--pokedex-red-dark) w-[10%] text-white text-left px-2 py-1">
        <SortButton
          attr="types"
          onClick={() => toggleSort("types")}
          sorting={sorting}
        >
          {t("table.types")}
        </SortButton>
      </th>
    </>
  );

  if (!heldBy) {
    const skeletonTableBody = [...Array(10)].map((_, i) => (
      <tr key={i} className="border-solid border-foreground border-b-2">
        {[...Array(4)].map((_, j) => {
          if (j === 0) {
            return (
              <td key={j} className="p-2 text-center justify-center flex">
                <SkeletonImage className="w-30 h-30" />
              </td>
            );
          }

          return (
            <td key={j} className="p-2 text-center justify-center">
              <SkeletonBlock className="w-10" />
            </td>
          );
        })}
      </tr>
    ));

    return (
      <div className="h-[-webkit-fill-available] w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0">
        <h3 className="w-fit text-lg mb-4">
          {t("item.heldBy.title", { total: String(heldBy?.length) })}
        </h3>
        <div className="h-[-webkit-fill-available]">
          <Table headers={tableHeaders}>{skeletonTableBody}</Table>
        </div>
      </div>
    );
  }

  const typesCell = (pokemon: IPkmn) => {
    if (!settings) return;

    return pokemon.types.map((type) => {
      return (
        <Link href={`/type/${type.type.name}`} key={type.type.name}>
          <Image
            width="100"
            height="20"
            className="inline m-1"
            alt={capitilize(type.type.name)}
            src={getTypeIconById(
              getIdFromUrlSubstring(type.type.url),
              settings!.typeArtworkUrl
            )}
          />
        </Link>
      );
    });
  };

  const sortMapping: SortMapping<SortKey, IPkmn> = (a, b) => ({
    id: [a.id, b.id],
    name: [a.name, b.name],
    types: [
      a.types.map((type) => type.type.name).join(","),
      b.types.map((type) => type.type.name).join(","),
    ],
  });

  const sortedPokemon =
    heldBy.sort(sortResources(sorting, sortMapping, "id")) ?? [];

  const tableBody = sortedPokemon.map((pokemon, idx, self) => {
    const isLast = idx === self.length - 1;
    return (
      <tr
        key={pokemon.id}
        className={`${
          !isLast ? "border-solid border-foreground  border-b-2" : ""
        }`}
      >
        <td className="p-2">
          <Link href={`/pokedex/${pokemon.name}`}>
            <PokemonThumb pokemonData={pokemon} size="xs" />
          </Link>
        </td>
        <td className="p-2 text-center">{getNumber(Number(pokemon.id))}</td>
        <td className="p-2">
          <Link
            className="transition-colors hover:bg-(--pokedex-red-dark) p-1"
            href={`/pokedex/${pokemon.name}`}
          >
            {normalizePokemonName(pokemon.name)}
          </Link>
        </td>
        <td className="p-2">{typesCell(pokemon)}</td>
      </tr>
    );
  });

  return (
    <div className="w-fit learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <div className="flex">
        <h3 className="w-fit text-lg mb-4">
          {t("items.heldBy.title", { total: heldBy?.length ?? 0 })}
        </h3>
        <Tooltip content={t("items.heldBy.description")}>
          <QuestionMarkCircleIcon className="w-5 hover:fill-(--pokedex-red)" />
        </Tooltip>
      </div>
      {!!heldBy?.length && <Table headers={tableHeaders}>{tableBody}</Table>}
    </div>
  );
}
