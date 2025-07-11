import PokeApiQuery from "@/app/query";
import { TypeUrl } from "@/components/[id]/details/types";

const pokeApiQuery = new PokeApiQuery();

export const getUser = async (email: string) => {
  const user = await pokeApiQuery.fetchURL<User>(`/api/user/${email}`);
  return user;
};

export const createUser = async (email: string) => {
  const user = await pokeApiQuery.postUrl<User>(`/api/user`, { email });
  return user;
};

export const getSettings = async (user_id: number) => {
  const settings = await pokeApiQuery.fetchURL<Settings>(`/api/user/${user_id}/settings`);
  return settings;
};

export const upsertSettings = async (body: Partial<Settings>, id?: number,) => {
  const user = await pokeApiQuery.postUrl<Settings>(`/api/user/${id}/settings`, body as Record<string, unknown>);
  return user;
};

export type User = { id: number; email: string } | null;

export type SortKey = 'id' | 'name' | 'hp' | 'types' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export type Settings = {
  artworkUrl: string,
  descriptionLang: string,
  listTable: boolean,
  showColumn: boolean[],
  showShowColumn: boolean,
  showThumbTable: boolean,
  thumbLabelList: string,
  thumbSizeList: string,
  typeArtworkUrl: TypeUrl,
  filter: { name: string, types: string },
  sorting: Array<{ key: SortKey, dir: '+' | '-' }>
} | null;
