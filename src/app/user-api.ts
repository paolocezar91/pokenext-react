import BaseQuery from "@/app/base-query";
import { TypeUrl } from "@/components/[id]/details/types";
import { SortKey as PokedexSortKey } from "@/components/pokedex/pokedex-table/pokedex-table";

export type User = { id: number; email: string } | null;

export type Settings = {
  artworkUrl: string,
  descriptionLang: string,
  listTable: boolean,
  showColumn: boolean[],
  showSettings: boolean,
  showShowColumn: boolean,
  showThumbTable: boolean,
  thumbLabelList: string,
  thumbSizeList: string,
  typeArtworkUrl: TypeUrl,
  filter: { name: string, types: string },
  sorting: Array<{ key: PokedexSortKey, dir: '+' | '-' }>
} | null;

export default class UserApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getUser = async (email: string) => {
    return await this.getURL<User>(`/api/graphql/user/${email}`);
  };

  createUser = async (email: string) => {
    return await this.postURL<User>(`/api/graphql/user`, { email });
  };

  getSettings = async (user_id: number) => {
    return await this.getURL<Settings>(`/api/graphql/settings/${user_id}`);
  };

  upsertSettings = async (body: Partial<Settings>, id?: number,) => {
    return await this.postURL<Settings>(`/api/graphql/settings/${id}`, body as Record<string, unknown>);
  };

}


