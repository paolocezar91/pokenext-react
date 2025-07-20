import { IPkmn } from "@/types/types";
import { IEvolutionChain, IMove, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
import BaseQuery from "./base-query";

export default class PokeApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getPokemons = async (offset: number, limit: number, filters?: Record<string, string>): Promise<{ results: IPkmn[], count: number }> => {
    let url = `/api/pokemon?limit=${limit}&offset=${offset}`;
    if(filters) {
      filters = this.cleanParams(filters);
      url += `&${new URLSearchParams(filters)}`;
    }
    return await this.getURL(url);
  };

  getPokemonByIds = async (ids: number[]): Promise<{ results: IPkmn[], count: number }> => {
    return await this.getURL(`/api/pokemon?ids=${ids}`);
  };

  getPokemonById = async (id: string): Promise<IPokemon> => {
    return await this.getURL(`/api/pokemon/${id}`);
  };

  getMove = async (id: string): Promise<IMove> => {
    return await this.getURL(`/api/moves/${id}`);
  };

  getMovesByIds = async (ids: number[]): Promise<{ results: IMove[], count: number }> => {
    return await this.getURL(`/api/moves?ids=${ids}`);
  };

  getSpecies = async (id: string): Promise<IPokemonSpecies> => {
    return await this.getURL(`/api/pokemon-species/${id}`);
  };

  getTypes = async (types: IPokemonType[]): Promise<IType[]> => {
    const fetchType = async (id: string) => await this.getURL<IType>(`/api/types/${id}`);
    return Promise.all(types.map(type => fetchType(type.type.name)));
  };

  getType = async (id: string): Promise<IType> => {
    return await this.getURL(`/api/types/${id}`);
  };

  getAllTypes = async (): Promise<IType[]> => {
    return await this.getURL(`/api/types`);
  };

  getEvolutionChain = async (id: string): Promise<IEvolutionChain> => {
    return await this.getURL<IEvolutionChain>(`/api/evolution-chain/${id}`);
  };
}