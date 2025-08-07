import { IPkmn } from "@/types/types";
import {
  IAbility,
  IEvolutionChain,
  IMachine,
  IMove,
  IMoveTarget,
  IPokemon,
  IPokemonForm,
  IPokemonSpecies,
  IPokemonType,
  IType
} from "pokeapi-typescript";
import BaseQuery from "./base-query";

export interface CountResults<T> { results: T[], count: number }
export default class PokeApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getPokemons = async (offset: number, limit: number, filters?: Record<string, string>): Promise<CountResults<IPkmn>> => {
    let url = `/api/graphql/pokemon?limit=${limit}&offset=${offset}`;
    if(filters) {
      filters = this.cleanParams(filters);
      url += `&${new URLSearchParams(filters)}`;
    }
    return await this.getURL(url);
  };

  getPokemonByIds = async (ids: number[], id_limit?: number): Promise<CountResults<IPkmn>> => {
    return await this.getURL(`/api/graphql/pokemon?ids=${ids}&id_limit=${id_limit}`);
  };

  getPokemonById = async (id: string): Promise<IPokemon> => {
    return await this.getURL(`/api/graphql/pokemon/${id}`);
  };

  getMove = async (id: string): Promise<IMove> => {
    return await this.getURL(`/api/graphql/moves/${id}`);
  };

  getMoves = async (): Promise<CountResults<IMove>> => {
    return await this.getURL(`/api/graphql/moves`);
  };

  getMovesByIds = async (ids: number[]): Promise<CountResults<IMove>> => {
    return await this.getURL(`/api/graphql/moves?ids=${ids}`);
  };

  getMachinesByIds = async (ids: number[]): Promise<CountResults<IMachine>> => {
    return await this.getURL(`/api/graphql/machines?ids=${ids}`);
  };

  getSpecies = async (id: string): Promise<IPokemonSpecies> => {
    return await this.getURL(`/api/graphql/pokemon-species/${id}`);
  };

  getTypes = async (types: IPokemonType[]): Promise<IType[]> => {
    const fetchType = async (id: string) => await this.getURL<IType>(`/api/graphql/types/${id}`);
    return Promise.all(types.map(type => fetchType(type.type.name)));
  };

  getType = async (id: string): Promise<IType> => {
    return await this.getURL(`/api/graphql/types/${id}`);
  };

  getAllTypes = async (): Promise<IType[]> => {
    return await this.getURL(`/api/graphql/types`);
  };

  getAbility = async (id: string): Promise<IAbility> => {
    return await this.getURL(`/api/graphql/abilities/${id}`);
  };

  getEvolutionChain = async (id: string): Promise<IEvolutionChain> => {
    return await this.getURL<IEvolutionChain>(`/api/graphql/evolution-chain/${id}`);
  };

  getMoveTarget = async (id: string): Promise<IMoveTarget> => {
    return await this.getURL<IMoveTarget>(`/api/graphql/move-target/${id}`);
  };

  getPokemonFormByIds = async (ids: number[]): Promise<CountResults<IPokemonForm>> => {
    return await this.getURL<CountResults<IPokemonForm>>(`/api/graphql/pokemon-form?ids=${ids}`);
  };
}