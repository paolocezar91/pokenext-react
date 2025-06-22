import { IEvolutionChain, IMove, INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
export default class PokeApiQuery {
  private apiUrl: string;

  constructor(api: string = process.env.POKEAPI_URL as string) {
    this.apiUrl = api;
  }

  fetchPokemonList = async (limit:number , offset: number) =>
    (await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/?limit=${limit}&offset=${offset}`)) as INamedApiResourceList<IPokemon>;

  fetchPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
    pkmnList.results.map(async (pkmn) => {
      const pokemon = await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/${pkmn.name}/`) as IPokemon;
      return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites, stats: pokemon.stats };
    })
  );

  fetchMove = async (id: string): Promise<IMove> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/move/${id}`) as IMove;
  };

  fetchPokemon = async (id: string): Promise<IPokemon> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/${id}`) as IPokemon;
  };

  fetchSpecies = async (id: string): Promise<IPokemonSpecies> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon-species/${id}`) as IPokemonSpecies;
  };

  fetchTypes = async (types: IPokemonType[]): Promise<IType[]> => {
    const fetchType = async (id: string) => await this._fetchAndJson(`${this.apiUrl}/api/v2/type/${id}`) as IType;
    return Promise.all(types.map(type => fetchType(type.type.name)));
  };

  fetchEvolutionChain = async (species: IPokemonSpecies): Promise<IEvolutionChain> => {
    return await this.fetchURL<IEvolutionChain>(`${this.apiUrl}${species.evolution_chain.url}`);
  };

  fetchURL = async <T>(url: string) => {
    return await this._fetchAndJson(`${url}`) as T;
  };

  private _fetchAndJson = async (url: string) => {
    try {
      const data = await fetch(url, { cache: 'force-cache' });
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

  postUrl = async (url: string, body: any) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      // Handle success (e.g., redirect)
    } catch (err: any) {
      throw err;
    } finally {
      return true;
    }
  };

}
