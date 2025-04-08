import { INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";

export const fetchPokemonList = async (limit:number , offset: number) => await (await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)).json() as INamedApiResourceList<IPokemon>;

export const fetchPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
  pkmnList.results.map(async (pkmn) => {
    const pokemon = (await(await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn.name}/`)).json()) as IPokemon;
    return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites };
  })
);

export const fetchPokemon = async (id: string): Promise<IPokemon> => {
  return await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json() as IPokemon;
};

export const fetchSpecies = async (id: string): Promise<IPokemonSpecies> => {
  return await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)).json() as IPokemonSpecies;
};

export const fetchTypes = async (types: IPokemonType[]): Promise<IType[]> => {
  const fetchType = async (id: string) => await (await fetch(`https://pokeapi.co/api/v2/type/${id}`)).json() as IType;
  return Promise.all(types.map(type => fetchType(type.type.name)));
};