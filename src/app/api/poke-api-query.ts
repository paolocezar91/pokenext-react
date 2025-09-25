import { IPkmn } from "@/types/types";
import {
  Ability,
  EvolutionChain,
  Machine,
  Move,
  MoveTarget,
  Pokemon,
  PokemonForm,
  PokemonSpecies,
  PokemonType,
  Type,
} from "pokeapi-typescript";
import BaseQuery from "./base-query";

export interface CountResults<T> {
  results: T[];
  count: number;
}
export default class PokeApiQuery extends BaseQuery {
  constructor() {
    super();
  }

  getPokemons = async (
    offset: number,
    limit: number,
    filters?: Record<string, string>
  ): Promise<CountResults<IPkmn>> => {
    let url = `/api/pokemon?limit=${limit}&offset=${offset}`;
    if (filters) {
      filters = this.cleanParams(filters);
      url += `&${new URLSearchParams(filters)}`;
    }
    return await this.getURL(url);
  };

  getPokemonByIds = async (
    ids: number[],
    id_limit?: number
  ): Promise<CountResults<IPkmn>> => {
    return await this.getURL(`/api/pokemon?ids=${ids}&id_limit=${id_limit}`);
  };

  getPokemonById = async (id: string): Promise<Pokemon> => {
    return await this.getURL(`/api/pokemon/${id}`);
  };

  getMove = async (id: string): Promise<Move> => {
    return await this.getURL(`/api/moves/${id}`);
  };

  getMoves = async (): Promise<CountResults<Move>> => {
    return await this.getURL(`/api/moves`);
  };

  getMovesByIds = async (ids: number[]): Promise<CountResults<Move>> => {
    return await this.getURL(`/api/moves?ids=${ids}`);
  };

  getMachinesByIds = async (ids: number[]): Promise<CountResults<Machine>> => {
    return await this.getURL(`/api/machines?ids=${ids}`);
  };

  getSpecies = async (id: string): Promise<PokemonSpecies> => {
    return await this.getURL(`/api/pokemon-species/${id}`);
  };

  getTypes = async (types: PokemonType[]): Promise<Type[]> => {
    const fetchType = async (id: string) =>
      await this.getURL<Type>(`/api/types/${id}`);
    return Promise.all(types.map((type) => fetchType(type.type.name)));
  };

  getType = async (id: string): Promise<Type> => {
    return await this.getURL(`/api/types/${id}`);
  };

  getAllTypes = async (): Promise<Type[]> => {
    return await this.getURL(`/api/types`);
  };

  getAbility = async (id: string): Promise<Ability> => {
    return await this.getURL(`/api/abilities/${id}`);
  };

  getEvolutionChain = async (id: string): Promise<EvolutionChain> => {
    return await this.getURL<EvolutionChain>(`/api/evolution-chain/${id}`);
  };

  getMoveTarget = async (id: string): Promise<MoveTarget> => {
    return await this.getURL<MoveTarget>(`/api/move-target/${id}`);
  };

  getPokemonFormByIds = async (
    ids: number[]
  ): Promise<CountResults<PokemonForm>> => {
    return await this.getURL<CountResults<PokemonForm>>(
      `/api/pokemon-form?ids=${ids}`
    );
  };
}
