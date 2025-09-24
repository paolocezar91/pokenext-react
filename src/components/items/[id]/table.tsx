import { getAllItem } from "@/app/services/item";
import Link from "@/components/shared/link";
import SortButton from "@/components/shared/table/sort-button";
import {
  SortingDir,
  SortMapping,
  sortResources,
  updateSortKeys,
} from "@/components/shared/table/sorting";
import Table from "@/components/shared/table/table";
import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { IItem } from "pokeapi-typescript";
import { useState } from "react";
export type SortKey = "name" | "category" | "cost";

export default function ItemTable() {
  const [sorting, setSorting] = useState<SortingDir<SortKey>[]>([]);

  const toggleSort = (key: SortKey) => {
    setSorting((prev) => updateSortKeys(prev, key));
  };

  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: () => getAllItem({ limit: 2500 }),
  });

  const sortMapping: SortMapping<SortKey, IItem> = (a, b) => ({
    name: [a.name, b.name],
    category: [a.category.name, b.category.name],
    cost: [a.cost, b.cost],
  });

  const normalize = (text: string) => {
    return capitilize(kebabToSpace(text));
  };

  const itemListHeaders = (
    <>
      <th className="bg-(--pokedex-red-dark) text-white text-left px-2 py-1">
        <SortButton
          attr="name"
          onClick={() => toggleSort("name")}
          sorting={sorting}
        >
          Item
        </SortButton>
      </th>
      <th className="bg-(--pokedex-red-dark) text-white text-left px-2 py-1">
        <SortButton
          attr="category"
          onClick={() => toggleSort("category")}
          sorting={sorting}
        >
          Category
        </SortButton>
      </th>
      <th className="bg-(--pokedex-red-dark) text-white text-left px-2 py-1">
        <SortButton
          attr="cost"
          onClick={() => toggleSort("cost")}
          sorting={sorting}
        >
          Cost
        </SortButton>
      </th>
    </>
  );

  if (!items?.results.length) return;

  const sortedItems =
    items.results.sort(sortResources(sorting, sortMapping, "name")) ?? [];

  const itemListData = sortedItems.map((item, idx) => (
    <tr key={idx} className="border-solid border-foreground border-b-2">
      <td className="px-2 py-2 text-left justify-center">
        <Link
          className="hover:bg-(--pokedex-red) p-1"
          href={`/item/${item.name}`}
        >
          {normalize(item.name)}
        </Link>
      </td>
      <td className="px-2 py-2 text-left justify-center">
        {normalize(item.category.name)}
      </td>
      <td className="px-2 py-2 text-left justify-center">
        {item.cost ? `${item.cost} $` : "N/A"}
      </td>
    </tr>
  ));

  return <Table headers={itemListHeaders}>{itemListData}</Table>;
}
