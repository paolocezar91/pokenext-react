import { IPokemon, IPokemonType } from "pokeapi-typescript";

export type IPkmn = {
    name: string;
    types: IPokemonType[]
    id: number;
}

export type SpeciesChain = {
    loaded: boolean;
    chain: Record<string, IPokemon[]>
};