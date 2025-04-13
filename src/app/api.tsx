import { IEvolutionChain, INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";

export const fetchPokemonList = async (limit:number , offset: number) => await (await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)).json() as INamedApiResourceList<IPokemon>;

export const fetchPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
  pkmnList.results.map(async (pkmn) => {
    const pokemon = (await(await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn.name}/`, {cache: 'force-cache'})).json()) as IPokemon;
    return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites };
  })
);

export const fetchPokemon = async (id: string): Promise<IPokemon> => {
  return await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {cache: 'force-cache'})).json() as IPokemon;
};

export const fetchSpecies = async (id: string): Promise<IPokemonSpecies> => {
  return await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {cache: 'force-cache'})).json() as IPokemonSpecies;
};

export const fetchTypes = async (types: IPokemonType[]): Promise<IType[]> => {
  const fetchType = async (id: string) => await (await fetch(`https://pokeapi.co/api/v2/type/${id}`, {cache: 'force-cache'})).json() as IType;
  return Promise.all(types.map(type => fetchType(type.type.name)));
};

export const fetchEvolutionChain = async (species: IPokemonSpecies) => {
  return await fetchURL<IEvolutionChain>(species.evolution_chain.url);
};

export async function fetchURL<T>(url: string) {
  return await (await fetch(url, {cache: 'force-cache'})).json() as T;
};