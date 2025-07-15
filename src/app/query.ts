import { IPkmn } from "@/types/types";
import { IEvolutionChain, IMove, INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
export default class PokeApiQuery {
  private apiUrl: string;

  constructor(api: string = process.env.POKEAPI_URL as string) {
    this.apiUrl = api;
  }

  getPokemonList = async (offset: number, limit: number, filters?: Record<string, string>): Promise<{ results: IPkmn[], count: number }> => {
    let url = `${this.apiUrl}/api/pokemon/?limit=${limit}&offset=${offset}`;
    if(filters) {
      filters = this.cleanParams(filters);
      url += `&${new URLSearchParams(filters)}`;
    }
    return await this._getUrl(url);
  };

  getPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
    pkmnList.results.map(async (pkmn) => {
      const pokemon = await this._getUrl(`${this.apiUrl}/api/v2/pokemon/${pkmn.name}/`);
      return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites, stats: pokemon.stats };
    })
  );

  getMove = async (id: string): Promise<IMove> => {
    return await this._getUrl(`${this.apiUrl}/api/moves/${id}`);
  };

  getManyMoves = async (ids: number[]): Promise<IPkmn[]> => {
    return await this._getUrl(`${this.apiUrl}/api/moves-many?ids=${ids}`);
  };

  getPokemon = async (id: string): Promise<IPokemon> => {
    return await this._getUrl(`${this.apiUrl}/api/pokemon/${id}`);
  };

  getSpecies = async (id: string): Promise<IPokemonSpecies> => {
    return await this._getUrl(`${this.apiUrl}/api/pokemon-species/${id}`);
  };

  getTypes = async (types: IPokemonType[]): Promise<IType[]> => {
    const fetchType = async (id: string) => await this._getUrl(`${this.apiUrl}/api/type/${id}`);
    return Promise.all(types.map(type => fetchType(type.type.name)));
  };

  getType = async (id: string): Promise<IType> => {
    return await this._getUrl(`${this.apiUrl}/api/type/${id}`);
  };

  getAllTypes = async (): Promise<IType[]> => {
    return await this._getUrl(`${this.apiUrl}/api/types`);
  };

  getEvolutionChain = async (species: IPokemonSpecies): Promise<IEvolutionChain> => {
    return await this.getURL<IEvolutionChain>(`${species.evolution_chain.url}`);
  };

  getURL = async <T>(url: string) => {
    return await this._getUrl(`${this.apiUrl}${url}`) as T;
  };

  postURL = async <T>(url: string, body: Record<string, unknown>) => {
    return await this._postUrl(`${this.apiUrl}${url}`, body) as T;
  };

  private _getUrl = async (url: string) => {
    try {
      const data = await fetch(url, {
        cache: 'force-cache'
      });

      if (data.status === 200) {
        const json = await data.json();
        return json;
      }
      throw { status: 404, text: data.statusText };
    } catch (error) {
      console.log({ error });
      throw { error };
    }
  };

  private _postUrl = async <T>(url: string, body: Record<string, unknown>) => {
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!data.ok) {
        throw new Error("Invalid credentials");
      }
      const json = await data.json();
      return json as T;
      // Handle success (e.g., redirect)
    } catch (err: any) {
      throw err;
    }
  };

  private cleanParams = (params: Record<string, string>) => {
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
    return params;
  };
}
