import { IPkmn } from "@/types/types";
import { IEvolutionChain, IMove, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
import BaseQuery from "./base-query";

interface CountResults<T> { results: T[], count: number }
export default class PokeApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getPokemons = async (offset: number, limit: number, filters?: Record<string, string>): Promise<CountResults<IPkmn>> => {
    let url = `/api/pokemon?limit=${limit}&offset=${offset}`;
    if(filters) {
      filters = this.cleanParams(filters);
      url += `&${new URLSearchParams(filters)}`;
    }
    return await this.getURL(url);
  };

  getPokemonByIds = async (ids: number[]): Promise<CountResults<IPkmn>> => {
    return await this.getURL(`/api/pokemon?ids=${ids}`);
  };

  getPokemonById = async (id: string): Promise<IPokemon> => {
    return await this.getURL(`/api/pokemon/${id}`);
  };

  getMove = async (id: string): Promise<IMove> => {
    return await this.getURL(`/api/moves/${id}`);
  };

  getMoves = async (): Promise<CountResults<IMove>> => {
    return await this.getURL(`/api/moves`);
  };

  getMovesByIds = async (ids: number[]): Promise<CountResults<IMove>> => {
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