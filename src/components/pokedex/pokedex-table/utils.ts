import { IPkmn, UserSettings } from "@/types/types";

export const shouldShowColumn = (settings: UserSettings, i: number) => settings?.showShowColumn || settings?.showColumn[i];

type SortKey = 'id' | 'name' | 'hp' | 'types' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export const sortPokemon = (sort: Record<SortKey, string>) => (a: IPkmn, b: IPkmn) => {
  const sortMapping: Record<SortKey, [number | string, number | string]> = {
    'types': [a.types.map(t => t.type.name).join(","), b.types.map(t => t.type.name).join(",")],
    'id': [Number(a.id), Number(b.id)],
    'name': [a.name, b.name],
    'hp': [a.stats[0].base_stat, b.stats[0].base_stat],
    'attack': [a.stats[1].base_stat, b.stats[1].base_stat],
    'defense': [a.stats[2].base_stat, b.stats[2].base_stat],
    'special-attack': [a.stats[3].base_stat, b.stats[3].base_stat],
    'special-defense': [a.stats[4].base_stat, b.stats[4].base_stat],
    'speed': [a.stats[5].base_stat, b.stats[5].base_stat],
  };

  // Get active sort keys in the order they were set
  const activeSortKeys = Object.keys(sort).filter((key) => sort[key]) as SortKey[];

  for (const key of activeSortKeys) {
    const [aVal, bVal] = sortMapping[key];
    if (aVal === undefined || bVal === undefined) continue;

    let cmp = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      cmp = aVal.localeCompare(bVal);
    } else {
      cmp = (aVal as number) - (bVal as number);
    }

    if (cmp !== 0) {
      return sort[key] === '+' ? cmp : -cmp;
    }
  }
  return sortMapping.id[0] as number - (sortMapping.id[1] as number);
};
