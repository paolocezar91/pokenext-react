import BaseQuery from "@/app/base-query";
import { TypeUrl } from "@/components/[id]/details/types";
import { SortKey as PokedexSortKey } from "@/components/pokedex/pokedex-table/pokedex-table";

export type User = { id: number; email: string } | null;

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
  sorting: Array<{ key: PokedexSortKey, dir: '+' | '-' }>
} | null;

export default class UserApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getUser = async (email: string) => {
    const user = await this.getURL<User>(`/api/user/${email}`);
    return user;
  };

  createUser = async (email: string) => {
    const user = await this.postURL<User>(`/api/user`, { email });
    return user;
  };

  getSettings = async (user_id: number) => {
    const settings = await this.getURL<Settings>(`/api/settings/${user_id}`);
    return settings;
  };

  upsertSettings = async (body: Partial<Settings>, id?: number,) => {
    const user = await this.postURL<Settings>(`/api/settings/${id}`, body as Record<string, unknown>);
    return user;
  };

}


