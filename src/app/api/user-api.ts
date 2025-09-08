import BaseQuery from "@/app/api/base-query";
import { TypeUrl } from "@/components/pokedex/[id]/details/types";
import { SortKey as PokedexSortKey } from "@/components/pokedex/pokedex-table/pokedex-table";

export type User = { id: string; email: string } | null;

export type Settings = {
  artworkUrl: string;
  descriptionLang: string;
  listTable: boolean;
  showColumn: boolean[];
  showSettings: boolean;
  showShowColumn: boolean;
  showThumbTable: boolean;
  thumbLabelList: string;
  thumbSizeList: string;
  typeArtworkUrl: TypeUrl;
  filter: { name: string; types: string };
  sorting: Array<{ key: PokedexSortKey; dir: "+" | "-" }>;
} | null;

export default class UserApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getUser = async (email: string) => {
    return await this.getURL<User>(`/api/user/${email}`);
  };

  createUser = async (email: string) => {
    return await this.postURL<User>(`/api/user`, { email });
  };

  getSettings = async (user_id: string) => {
    return await this.getURL<Settings>(`/api/settings/${user_id}`);
  };

  upsertSettings = async (body: Partial<Settings>, id?: string) => {
    return await this.postURL<Settings>(
      `/api/settings/${id}`,
      body as Record<string, unknown>,
    );
  };

  setSettingsRedis = async (user_id: string, updatedSettings: unknown) => {
    return await this.postURL(
      `/api/cache/settings/${user_id}`,
      updatedSettings as Record<string, unknown>,
    );
  };

  getSettingsRedis = async (user_id: string) => {
    return await this.getURL(`/api/cache/settings/${user_id}`);
  };
}
