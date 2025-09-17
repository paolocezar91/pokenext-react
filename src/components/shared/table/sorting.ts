export type SortingDir<T> = { key: T; dir: "+" | "-" };
// eslint-disable-next-line no-unused-vars
export type SortMapping<T extends string, U> = (
  a: U,
  b: U
) => Record<T, [number | string, number | string]>;

export function sortResources<T extends string, U>(
  sorting: Array<{ key: T; dir: "+" | "-" }>,
  sortMapping: SortMapping<T, U>,
  defaultKey: string
) {
  return (a: U, b: U) => {
    for (const { key, dir } of sorting) {
      const [aVal, bVal] = sortMapping(a, b)[key];
      if (aVal === undefined || bVal === undefined) continue;

      let cmp = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = (aVal as number) - (bVal as number);
      }

      if (cmp !== 0) {
        return dir === "+" ? cmp : -cmp;
      }
    }
    return (
      (sortMapping(a, b)[defaultKey as T][0] as number) -
      (sortMapping(a, b)[defaultKey as T][1] as number)
    );
  };
}

export function updateSortKeys<T>(prevSorting: SortingDir<T>[], key: T) {
  const idx = prevSorting.findIndex((s) => s.key === key);
  let updated: Array<{ key: T; dir: "+" | "-" }> = [];
  if (idx === -1) {
    // if it's not there add as asc
    updated = [...prevSorting, { key, dir: "+" }];
  } else if (prevSorting[idx].dir === "+") {
    // if it's there change it to desc
    updated = [...prevSorting];
    updated[idx].dir = "-";
  } else {
    // then remove it on third click
    updated = prevSorting.filter((_, i) => i !== idx);
  }
  return updated;
}
